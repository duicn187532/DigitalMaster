// src/app/star-rating/page.tsx (示例路徑)
"use client";

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import { StarForm, Master } from "../types/common";
import { addStar } from "../api/api";
import DropZone from "../components/DropZone";
import { StarType } from "../types/common";


const StarRating: React.FC = () => {
  // 從 router state 取得勾選名單
  const location = useLocation();
  const { selectedMasters = [] } = location.state || {};

  // 新增星星評分表單相關狀態
  const [ratingDate, setRatingDate] = useState("");
  const [ratingType, setRatingType] = useState("1");
  const [score, setScore] = useState<number>(0);
  const [remarksData, setRemarksData] = useState<{ [id: string]: string }>({});

  // CSV 拖曳上傳：父層管理 file 狀態
  const [file, setFile] = useState<File | null>(null);

  // 新增星星評分 - 送出
  const handleSaveScore = async () => {
    try {
      const starArray: StarForm[] = selectedMasters
      .map((master: Master) => ({
        supervisorId: master.id,
        score: score,
        type: ratingType,
        date: ratingDate ? new Date(`${ratingDate}T00:00:00`) : new Date(),
        remarks: remarksData[master.id] ?? "",
      }));    
      await addStar(starArray);
      alert("傳送成功");
      // 重置
      setRatingDate("");
      setRemarksData({});
    } catch (error) {
      console.error("取得資料錯誤:", error);
      alert("傳送失敗");
    }
  };

  // CSV 上傳 - 解析並送出
  const handleUploadCSV = async () => {
    if (!file) {
      alert("請先拖曳或選擇 CSV 檔案");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "utf-8", // 明確指定 UTF-8 編碼
      complete: async (results) => {
        const starData: StarForm[] = results.data.map((row: any) => {
          const date = row.date
            ? new Date(`${row.date}T00:00:00+08:00`)
            : new Date();
          return {
            supervisorId: row.supervisorId,
            score: parseInt(row.score),
            type: row.type,
            date,
            remarks: row.remarks || "",
          };
        });
        try {
          const response = await addStar(starData);
          console.log("CSV 上傳成功:", response);
          alert("CSV 上傳成功");
          // 若要重置 file 狀態
          setFile(null);
        } catch (error) {
          console.error("CSV 上傳錯誤:", error);
          alert("CSV 上傳錯誤");
        }
      },
      error: (error) => {
        console.error("CSV 解析錯誤:", error);
        alert("CSV 解析錯誤");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 區塊 1：新增星星評分 */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">新增星星評分</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              評分日期
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={ratingDate}
              onChange={(e) => setRatingDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              類型
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={ratingType}
              onChange={(e) => setRatingType(e.target.value)}
            >
              {Object.keys(StarType).map((key) => (
                <option key={key} value={key}>
                  {StarType[key].name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分數
            </label>

            <input
              type="number"
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="分數"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border">行編</th>
                <th className="px-4 py-2 border">姓名</th>
                <th className="px-4 py-2 border">分行</th>
                <th className="px-4 py-2 border">備註</th>
              </tr>
            </thead>
            <tbody>
              {selectedMasters.map((master: Master) => (
                <tr key={master.id} className="border-b">
                  <td className="px-4 py-2">{master.id}</td>
                  <td className="px-4 py-2">{master.name}</td>
                  <td className="px-4 py-2">{master.branchCode}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="備註"
                      value={remarksData[master.id] ?? ""}
                      onChange={(e) =>
                        setRemarksData((prev) => ({
                          ...prev,
                          [master.id]: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={handleSaveScore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            儲存評分
          </button>
        </div>
      </div>

      {/* 區塊 2：CSV 拖曳上傳 */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">CSV上傳</h2>
        <DropZone
          onFileSelect={(f) => setFile(f)}
          accept={{ "text/csv": [".csv"] }}
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            已選擇檔案：<span className="font-medium">{file.name}</span>
          </p>
        )}
        <div className="text-right mt-4">
          <button
            onClick={handleUploadCSV}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            上傳
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarRating;
