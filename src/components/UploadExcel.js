import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcel() {
  const [excelData, setExcelData] = useState([]);
  const [formattedTitleDate, setFormattedTitleDate] = useState("");

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

      // Verwijder specifieke kolommen, hernoem headers, formatteer MomentRTA, verwijder voorlooptekens ('), en vervang NULL
      const updatedData = data.map((row, index) => {
        if (index === 0) {
          // Hernoem headers en verwijder specifieke kolommen
          return row
            .filter((_, colIndex) => ![11, 12, 13, 14, 15, 16].includes(colIndex))
            .map((header) => {
              switch (header) {
                case "OrderId":
                  return "Ordernr.";
                case "SjOrderId":
                  return "Sjabloonnr.";
                case "OrdSubTaskNo":
                  return "Taaknr.";
                case "LocName":
                  return "Naam";
                case "LocStreet":
                  return "Adres";
                case "LocZip":
                  return "Postcode";
                case "LocCity":
                  return "Plaats";
                case "LocCountry":
                  return "Land";
                case "LocContact":
                  return "Contact";
                case "LocPhone":
                  return "Telefoonnummer";
                case "LocMobile":
                  return "Mobiel";
                case "LocLocation":
                  return "Locatie";
                case "ColliDescription":
                  return "Omschrijving";
                case "Routenumber":
                  return "Route";
                default:
                  return header;
              }
            });
        }
        const formattedRow = row
          .filter((_, colIndex) => ![11, 12, 13, 14, 15, 16].includes(colIndex))
          .map((cell, colIndex) => {
            // Vervang NULL door lege string
            if (cell === "NULL") return "";
            // Verwijder voorloopteken ' voor Telefoonnummer (index 9) en Mobiel (index 10)
            if ((colIndex === 9 || colIndex === 10) && typeof cell === "string") {
              return cell.replace(/^'/, "");
            }
            return cell;
          });

        // Format MomentRTA (index 12 in originele data) voor de titel
        if (index === 1 && row[12]) {
          const momentRTAValue = row[12];
          const date = new Date(momentRTAValue);
          const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
          setFormattedTitleDate(date.toLocaleDateString("nl-NL", options));
        }

        return formattedRow;
      });

      setExcelData(updatedData);
    };
  };

  const copyToClipboard = (columnIndex) => {
    const values = excelData.slice(1).map((row) => row[columnIndex]).join("\n");
    navigator.clipboard.writeText(values).then(() => {
      alert("Gegevens gekopieerd naar klembord!");
    });
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
          <h2 className="text-lg font-semibold">Mestmonsters Eurofins {formattedTitleDate}</h2>

          <div className="mb-4">
            <button
              onClick={() => copyToClipboard(0)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Kopieer Ordernrs
            </button>
            <button
              onClick={() => copyToClipboard(1)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Kopieer Sjabloonnrs
            </button>
            <button
              onClick={() => copyToClipboard(2)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Kopieer Taaknrs
            </button>
          </div>

          <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
            <thead>
              <tr>
                {excelData[0].map((header, index) => (
                  <th key={index} className="border border-gray-300 px-2 py-1 text-left bg-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
