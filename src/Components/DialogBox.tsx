// src/Components/DialogBox.tsx
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

export default function DialogBox({ isOpen, onClose, onConfirm, message }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">User Added Successfully</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={onConfirm} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add More
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}