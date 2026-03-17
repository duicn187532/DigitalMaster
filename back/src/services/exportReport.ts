import * as XLSX from "xlsx";
import { Star } from "../types/common";

export interface ExportData {
  id: string;           // 必須有，對應到 star.masterId
  rowNumber: string;
  name: string;
  region: string;
  branch: string;
  stars: number;
}

/**
 * 匯出 CSV 檔案，並包含每位達人依「星星類型」統計的欄位
 * 
 * @param data           主資料表（通常為 filteredData）
 * @param fileName       匯出檔案名稱（預設為報表）
 * @param allStars       所有星星記錄（有效的 Star）
 */
export const exportToCSV = (
  data: ExportData[],
  fileName: string = "報表",
  allStars: Star[] = []
) => {
  // 🔍 取得所有有效的星星類型
  const allTypesSet = new Set<string>();
  allStars.forEach((star) => {
    if (star.valid !== false) {
      allTypesSet.add(star.type);
    }
  });

  // ✨ 可加入自定排序或中文別名邏輯
  const allTypes = Array.from(allTypesSet).sort((a, b) =>
    a.localeCompare(b, "zh-Hant")
  );

  // 📊 建立每一筆匯出資料
  const csvData = data.map(row => {
    const starsOfRow = allStars.filter(
      (s) => s.masterId === row.id && s.valid !== false
    );

    const typeCount: Record<string, number> = {};
    starsOfRow.forEach((s) => {
      typeCount[s.type] = (typeCount[s.type] || 0) + s.score;
    });

    const rowData: Record<string, string | number> = {
      行編: row.rowNumber,
      姓名: row.name,
      區域: row.region,
      分行: row.branch,
      星數: row.stars,
    };

    // ➕ 加入動態類型欄位
    allTypes.forEach((type) => {
      rowData[`星星類型：${type}`] = typeCount[type] || 0;
    });

    return rowData;
  });

  // 📄 匯出為 CSV 檔案
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
