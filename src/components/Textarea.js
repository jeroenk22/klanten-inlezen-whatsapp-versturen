import React from "react";

export default function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-4 w-3/4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-20 shadow-inner"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
