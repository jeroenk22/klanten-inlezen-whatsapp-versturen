import React from "react";
import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose} // Sluit het modal
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✖
          </button>
        </div>

        {/* Scrollbare inhoud */}
        <div className="overflow-y-auto flex-1 max-h-[70vh] mb-4">
          {children}
        </div>

        {/* Button onderaan */}
        <div className="flex justify-end">
          <Button text="Sluiten" color="bg-red-500" onClick={onClose} />
          <Button text="Bevestigen" color="bg-green-500" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
