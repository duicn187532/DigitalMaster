// src/components/AddMasterModal.tsx
"use client";

import { FC, FormEvent, useState } from "react";

// 範例的表單資料型別，可依需求調整
interface MasterFormData {
  id: string;
  name: string;
  branchCode: string;
}

interface AddMasterModalProps {
  // 父層傳入的初始表單資料（若需要預設值）
  formData: MasterFormData;
  // 點擊「儲存」後要呼叫的函式
  onSave: (data: MasterFormData) => void;
  // 點擊「取消」或背景關閉 Modal
  onClose: () => void;
}

const AddMasterModal: FC<AddMasterModalProps> = ({ formData, onSave, onClose }) => {
  const [localForm, setLocalForm] = useState<MasterFormData>(formData);

  // 提交表單
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(localForm);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl text-center font-semibold mb-4">新增達人</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">行編</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="請輸入行編"
            value={localForm.id}
            onChange={(e) => setLocalForm({ ...localForm, id: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="請輸入姓名"
            value={localForm.name}
            onChange={(e) => setLocalForm({ ...localForm, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分行</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="請輸入分行"
            value={localForm.branchCode}
            onChange={(e) => setLocalForm({ ...localForm, branchCode: e.target.value })}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMasterModal;
