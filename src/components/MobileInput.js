import React from "react";
import { validateMobileNumber } from "../utils/validation";

export default function MobileInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      className={`w-full border px-1 ${
        validateMobileNumber(value) ? "border-green-500" : "border-red-500"
      }`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
