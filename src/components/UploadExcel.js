import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcel() {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData(data);
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Upload Excel & Verwerk Gegevens</h1>
      
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="mb-4"
        onChange={handleFileUpload} 
      />

      {excelData.length > 0 && (
        <div className="mt-4 border p-2">
          <h2 className="text-lg font-semibold">Voorbeeld Data:</h2>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(excelData.slice(0, 30), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
