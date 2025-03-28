"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { addClass, deleteClass, fetchClass } from "../api/api";
import Modal from "../components/Modal";
import AddClassModal from "../components/AddClassModal";
import { ClassData, AddClassForm } from "../types/common";

// 定義課程類型
export const classType: Record<string, Record<string, any>> = {
  "1" : {name: "線上", img: "../assets/attend.png"},
  "2" : {name: "數位", img: "../assets/interact.png"},
  "3" : {name: "實體", img: "../assets/cases.png"},
};

const ClassManagement: React.FC = () => {
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const initialForm: AddClassForm = useMemo(() => ({
    date: "",
    startTime: "",
    endTime: "",
    name: "",
    type: "",
  }), []);

  // Memoized load classes function to prevent unnecessary re-renders
  const loadClasses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchClass();
      setClassData(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("獲取課程數據失敗:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use useEffect with the memoized loadClasses function
  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleAddClass = useCallback(() => {
    setShowAddClassModal(true);
  }, []);

  const handleCloseAddClass = useCallback(() => {
    setShowAddClassModal(false);
  }, []);

  const handleSaveClass = useCallback(async (formData: AddClassForm) => {
    try {
      const newClass = await addClass(formData);
      setClassData(prev => {
        // Prevent duplicate entries by checking if the class already exists
        const exists = prev.some(cls => cls._id === newClass._id);
        return exists ? prev : [...prev, newClass];
      });
      handleCloseAddClass();
    } catch (error) {
      console.error("新增課程失敗:", error);
      alert("新增課程失敗，請稍後再試");
    }
  }, [handleCloseAddClass]);

  const handleExport = useCallback(() => {
    alert("匯出資料功能尚未實作");
  }, []);

  const handleEdit = useCallback((id: string) => {
    alert(`編輯課程 ID: ${id}`);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("確定要刪除此課程嗎？")) return;
    deleteClass(id);
    // 假設從前端刪除即可；實際應呼叫 API
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 搜尋列 & 按鈕 */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={handleAddClass}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            新增課程
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            匯出資料
          </button>
        </div>
      </div>

      {/* 課程表 (保持原本的實作) */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  課程日期
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  課程時間
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  課程名稱
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  授課方式
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                    加載中...
                  </td>
                </tr>
              ) : classData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                    目前沒有符合條件的課程資料
                  </td>
                </tr>
              ) : (
                classData.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cls.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cls.startTime} ~ {cls.endTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cls.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {classType[cls.type]?.name || "未知"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(cls._id)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* 新增課程 Modal */}
      <Modal isOpen={showAddClassModal} onClose={handleCloseAddClass}>
        <AddClassModal
          formData={initialForm}
          onClose={handleCloseAddClass}
          onSave={handleSaveClass}
        />
      </Modal>
    </div>
  );
};

export default ClassManagement;