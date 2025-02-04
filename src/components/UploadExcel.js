import React, { useState } from "react";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";

export default function UploadExcel() {
  const [excelData, setExcelData] = useState([]);
  const [formattedTitleDate, setFormattedTitleDate] = useState("");

  const handleFileUpload = (data, titleDate) => {
    setExcelData(data);
    setFormattedTitleDate(titleDate);
  };

  const handleInputChange = (rowIndex, value) => {
    setExcelData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex][11] = { value, editable: true }; // Mobiel index is 11
      return updatedData;
    });
  };

  const copyToClipboard = (columnIndex) => {
    const values = excelData.slice(1).map((row) => row[columnIndex]?.value || row[columnIndex]).join("\n");
    navigator.clipboard.writeText(values).then(() => {
      alert("Gegevens gekopieerd naar klembord!");
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Upload Excel & Verwerk Gegevens</h1>
      <FileUploader onUpload={handleFileUpload} />
      {excelData.length > 0 && (
        <DataTable
          data={excelData}
          titleDate={formattedTitleDate}
          onInputChange={handleInputChange}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
}
