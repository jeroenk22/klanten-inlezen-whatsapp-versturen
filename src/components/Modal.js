import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Generieke inhoud via children */}
        {children}

        <button className="mt-4 p-2 bg-red-500 text-white rounded w-full" onClick={onClose}>
          Sluiten
        </button>
      </div>
    </div>
  );
}