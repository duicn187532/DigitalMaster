import * as XLSX from "xlsx";

export interface ExportData {
  rowNumber: string;
  name: string;
  region: string;
  branch: string;
  stars: number;
}

export const exportToCSV = (data: ExportData[], fileName: string = "報表") => {
  const csvData = data.map(row => ({
    行編: row.rowNumber,
    姓名: row.name,
    區域: row.region,
    分行: row.branch,
    星數: row.stars
  }));

  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "資料");

  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};