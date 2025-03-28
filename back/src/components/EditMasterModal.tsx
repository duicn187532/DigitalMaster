"use client";

import { FC, useState, FormEvent } from "react";
import { Master } from "../types/common";

interface EditMasterModalProps {
  masterData: Master;
  onClose: () => void;
  onSave: (data: Master) => void;
}

const EditMasterModal: FC<EditMasterModalProps> = ({ masterData, onClose, onSave }) => {
  // 初始化狀態以 masterData 的值
  const [name, setName] = useState(masterData.name);
  const [branchCode, setBranchCode] = useState(masterData.branchCode || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 組合更新後的資料，id 不可編輯
    const updatedData: Master = {
      ...masterData,
      name,
      branchCode,
    };
    onSave(updatedData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">編輯達人資料</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">行編</label>
          <input
            type="text"
            value={masterData.id}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">分行</label>
          <input
            type="text"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMasterModal;
