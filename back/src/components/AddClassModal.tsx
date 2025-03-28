"use client";

import React, { useState, FormEvent } from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";

// 定義表單資料結構
interface AddClassForm {
  date: string;      // mm/dd/yyyy
  startTime: string; // hh:mm
  endTime: string;   // hh:mm
  name: string;      // 課程名稱
  type: string;      // 課程型態
}

interface AddClassModalProps {
  formData: AddClassForm;
  onClose: () => void;
  onSave: (data: AddClassForm) => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  formData,
  onClose,
  onSave,
}) => {
  // 這裡將日期與時間改用 Date | null 儲存，以便 MUI 運作
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [startTimeValue, setStartTimeValue] = useState<Date | null>(null);
  const [endTimeValue, setEndTimeValue] = useState<Date | null>(null);
  const [name, setName] = useState(formData.name);
  const [type, setType] = useState(formData.type);

  // 初始化：若有預設值，可嘗試 parse 字串為 Date
  // 這裡示範略過，預設空

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 將 Date 物件轉為字串
    const dateStr = dateValue ? format(dateValue, "MM/dd/yyyy") : "";
    const startTimeStr = startTimeValue ? format(startTimeValue, "HH:mm") : "";
    const endTimeStr = endTimeValue ? format(endTimeValue, "HH:mm") : "";

    // 組合回傳資料
    onSave({
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      name,
      type,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">新增課程</h2>
      {/* MUI Pickers 需要 LocalizationProvider 包裹 */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 課程日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              課程日期
            </label>
            <DatePicker
              label="選擇日期"
              value={dateValue}
              onChange={(newValue) => setDateValue(newValue)}
              slotProps={{
                textField: {
                  placeholder: "請選擇日期",
                  className: "mt-1 block w-full border rounded p-2",
                },
              }}                />
          </div>

          {/* 開始 / 結束時間 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始時間
              </label>
              <TimePicker
                label="選擇開始時間"
                value={startTimeValue}
                onChange={(newValue) => setStartTimeValue(newValue)}
                slotProps={{
                  textField: {
                    placeholder: "請選擇開始時間",
                    className: "mt-1 block w-full border rounded p-2",
                  },
                }}              
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                結束時間
              </label>
              <TimePicker
                label="選擇結束時間"
                value={endTimeValue}
                onChange={(newValue) => setEndTimeValue(newValue)}
                slotProps={{
                  textField: {
                    placeholder: "請選擇結束時間",
                    className: "mt-1 block w-full border rounded p-2",
                  },
                }}                  />
            </div>
          </div>

          {/* 課程名稱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              課程名稱
            </label>
            <input
              type="text"
              placeholder="課程名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          {/* 課程型態 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              課程型態
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">請選擇</option>
              <option value="1">線上</option>
              <option value="2">實體</option>
              <option value="3">混合</option>
            </select>
          </div>

          {/* 按鈕區 */}
          <div className="text-right mt-4 flex justify-end gap-2">
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
              儲存課程
            </button>
          </div>
        </form>
      </LocalizationProvider>
    </div>
  );
};

export default AddClassModal;
