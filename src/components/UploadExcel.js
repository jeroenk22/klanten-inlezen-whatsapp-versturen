import React, { useState } from "react";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";

export default function UploadExcel() {
  const [excelData, setExcelData] = useState([]);
  const [formattedTitleDate, setFormattedTitleDate] = useState("");
  const [fileKey, setFileKey] = useState(Date.now()); // Key voor bestand-input

  const handleFileUpload = (data, titleDate) => {
    setExcelData(data);
    setFormattedTitleDate(titleDate);
  };

  const handleReset = () => {
    setExcelData([]); // Verwijder de ingelezen data
    setFormattedTitleDate(""); // Reset de titel
    setFileKey(Date.now()); // Verander key zodat file input wordt gereset
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
      <h1 className="text-xl font-bold mb-2">Verstuur Whatsapp bericht naar mestklanten</h1>
      <FileUploader onUpload={handleFileUpload} key={fileKey} />
      {excelData.length > 0 && (
        <DataTable
          data={excelData}
          titleDate={formattedTitleDate}
          onInputChange={handleInputChange}
          onCopy={copyToClipboard}
          onReset={handleReset} 
        />
      )}
    </div>
  );
}
