import React from "react";
import { processExcelFile } from "../utils/excel"; // ✅ Importeer de nieuwe helper-functie

export default function FileUploader({ onUpload }) {
  return (
    <div>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="mb-4"
        onChange={(event) => processExcelFile(event.target.files[0], onUpload)} 
      />
    </div>
  );
}