"use client";

import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../components/DataTable";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StarType } from "../types/common";
import { deleteStar, fetchStars } from "../api/api";

interface Star {
  _id?: string;
  id?: string;
  supervisorId: string;
  score: number;
  type: string;
  date: string;
  valid?: boolean;
}

const RatingDetail: React.FC = () => {
  const [allStarData, setAllStarData] = useState<Star[]>([]);
  const [filteredData, setFilteredData] = useState<Star[]>([]);
  const [filterSupervisor, setFilterSupervisor] = useState("");
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function getStarData() {
      try {
        // 直接取得 Star[] 資料
        const data: Star[] = await fetchStars();
        const validStars = data
          .filter((star) => star.valid !== false)
          .map((star) => ({
            ...star,
            typeName: StarType[star.type].name || star.type,
          }));
        setAllStarData(validStars);
        setFilteredData(validStars);
      } catch (error) {
        console.error("取得星星明細錯誤:", error);
      }
    }
    getStarData();
  }, []);
      
  // 篩選資料
  useEffect(() => {
    let filtered = [...allStarData];

    if (filterSupervisor.trim() !== "") {
      filtered = filtered.filter(star => star.supervisorId.includes(filterSupervisor.trim()));
    }

    if (filterType !== "") {
      filtered = filtered.filter(star => star.type === filterType);
    }

    if (startDate) {
      filtered = filtered.filter(star => new Date(star.date) >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(star => new Date(star.date) <= endDate);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // 重設頁碼
  }, [allStarData, filterSupervisor, filterType, startDate, endDate]);

  // 分頁處理
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // 標記資料為無效 (軟刪除)
  const handleDeleteStar = async (starId: string) => {
    if (!confirm("確定要將這筆星星資料標記為無效嗎？")) return;

    try {
        const res = await deleteStar(starId);
        
        if (!res) {  // 確認 res 是真實存在的物件，且具有 ok 屬性
            throw new Error("更新失敗");
        }

        // 從本地資料移除，不發起新的 API 請求
        setAllStarData(prev => prev.filter(star => star._id !== starId));
    } catch (error) {
        console.error("標記無效錯誤:", error);
        alert("更新失敗");
    }
  };

  const columns = [
    { id: "supervisorId", label: "行編", sortable: true },
    { id: "score", label: "分數", sortable: true },
    { id: "typeName", label: "類型", sortable: true },
    { 
      id: "date", 
      label: "日期", 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" }),
    },
    { 
      id: "actions", 
      label: "動作",
      render: (_: any, row: Star) => (
        <button
          onClick={() => handleDeleteStar(row._id || row.id || "")}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          刪除
        </button>
      )
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-6 min-h-full bg-gray-100">

        {/* 篩選條件表單 */}
        <div className="mb-4 bg-white shadow rounded p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <input
              type="text"
              placeholder="行編"
              className="mt-1 block w-full border rounded p-2"
              value={filterSupervisor}
              onChange={(e) => setFilterSupervisor(e.target.value)}
            />
            <select
              className="mt-1 block w-full border rounded p-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">類型</option>
              {Object.keys(StarType).map((key) => (
                <option key={key} value={key}>
                  {StarType[key].name}
                </option>
              ))}
            </select>
            <DatePicker className="w-full" label="開始日期" value={startDate} onChange={setStartDate} />
            <DatePicker className="w-full" label="結束日期" value={endDate} onChange={setEndDate} />
          </div>
        </div>

        {/* 資料表格 */}
        <DataTable
          title="評分明細"
          columns={columns}
          data={paginatedData}
          pagination={{
            pageSize,
            currentPage,
            totalItems: filteredData.length,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default RatingDetail;
