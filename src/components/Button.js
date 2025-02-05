import React from "react";

export default function Button({ onClick, text, color, icon }) {
  return (
    <button
      className={`mr-2 p-2 rounded text-white ${color}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}