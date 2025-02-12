import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ButtonIcon from "./ButtonIcon";

// Tailwind ondersteunt deze kleuren, dus we definiëren handmatig hun hover-variant
const hoverColors = {
  "bg-blue-500": "hover:bg-blue-700",
  "bg-green-500": "hover:bg-green-700",
  "bg-red-500": "hover:bg-red-700",
  "bg-yellow-500": "hover:bg-yellow-700",
  "bg-gray-500": "hover:bg-gray-700",
  "bg-indigo-500": "hover:bg-indigo-700",
  "bg-purple-500": "hover:bg-purple-700",
  "bg-pink-500": "hover:bg-pink-700",
  "bg-orange-500": "hover:bg-orange-700", // ✅ Opgelost! Orange wordt nu correct herkend
  "bg-teal-500": "hover:bg-teal-700",
};

// Bepaal de juiste hover-kleur
const getHoverColor = (color) => hoverColors[color] || "";

export default function Button({
  onClick,
  text,
  color,
  icon,
  loading,
  disabled,
}) {
  const hoverColor = getHoverColor(color);

  return (
    <button
      className={`mr-2 p-2 rounded text-white ${color} ${hoverColor} ${
        loading || disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={loading || disabled}
    >
      {loading && <LoadingSpinner />}
      {icon && <ButtonIcon icon={icon} />}
      {text}
    </button>
  );
}
