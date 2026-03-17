"use client";

import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  onFileSelect: (file: File | null) => void;
  accept?: Record<string, string[]>;
}

const DropZone: FC<DropZoneProps> = ({ onFileSelect, accept }) => {
  // onDrop callback：若成功接收到檔案，傳給父層
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  // 若未指定 accept，則預設只接受 CSV
  const dropzoneAccept = accept ?? { "text/csv": [".csv"] };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: dropzoneAccept,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-blue-300 border-dashed rounded p-10 text-center cursor-pointer transition-colors
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
      `}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600">放開檔案即可上傳</p>
      ) : (
        <p className="text-gray-600">
          Click or Pull to upload
        </p>
      )}
      {acceptedFiles.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          已選擇檔案：<span className="font-medium">{acceptedFiles[0].name}</span>
        </p>
      )}
    </div>
  );
};

export default DropZone;
