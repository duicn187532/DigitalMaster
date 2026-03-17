// src/components/Modal.tsx
"use client";

import { FC, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 黑幕 (Overlay) */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* 對話框容器 */}
      <div className="relative bg-white w-full max-w-lg mx-auto p-6 rounded shadow-lg z-10">
        {children}
      </div>
    </div>
  );
};

export default Modal;
