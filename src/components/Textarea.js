import React, { useRef, useEffect } from "react";

export default function Textarea({ label, value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  // Pas de hoogte automatisch aan bij wijzigen van de tekst
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset de hoogte eerst
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Stel nieuwe hoogte in
    }
  }, [value]); // Effect uitvoeren bij wijziging van de tekst

  return (
    <div className="mb-4 w-3/4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner resize-none overflow-hidden"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={1} // Start met 1 regel
      />
    </div>
  );
}
