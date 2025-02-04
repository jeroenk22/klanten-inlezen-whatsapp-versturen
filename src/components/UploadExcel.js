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
      const workbook = XLSX.read(e.target.result, { type: "binary", cellText: false, cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Zet alle cellen om naar strings om problemen met telefoonnummers te voorkomen
      Object.keys(sheet).forEach((cell) => {
        if (sheet[cell] && sheet[cell].t === "n") {
          sheet[cell].z = "@"; // Zorgt ervoor dat Excel het als string behandelt
          sheet[cell].t = "s"; // Forceert string type
          sheet[cell].v = String(sheet[cell].v); // Converteer expliciet naar string
        }
      });

      let data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Verwijder voorlooptekens (') uit kolommen LocPhone en LocMobile
      const updatedData = data.map((row, index) => {
        if (index === 0) return row; // Laat headers ongewijzigd
        return [
          ...row.slice(0, 9),
          row[9] && row[9] !== "NULL" ? row[9].replace(/^'/, "") : "", // LocPhone
          row[10] && row[10] !== "NULL" ? row[10].replace(/^'/, "") : "", // LocMobile
          ...row.slice(11)
        ];
      });

      setExcelData(updatedData);
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
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(excelData.slice(0, 5), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
