import React from "react";
import * as XLSX from "xlsx";

export default function FileUploader({ onUpload }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary", cellText: false, cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      Object.keys(sheet).forEach((cell) => {
        if (sheet[cell] && sheet[cell].t === "n") {
          sheet[cell].z = "@";
          sheet[cell].t = "s";
          sheet[cell].v = String(sheet[cell].v);
        }
      });

      let data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Haal MomentRTA op en formatteer de datum
      const momentRTAIndex = data[0].indexOf("MomentRTA");
      const formattedDate = momentRTAIndex !== -1 ? formatDate(data[1]?.[momentRTAIndex]) : "";

      // Verwijder de ongewenste kolommen en verwerk de data
      const updatedData = data.map((row, index) => {
        if (index === 0) {
          return ["#", ...row
            .map(renameHeader)
            .filter((header) => !["MomentETD", "MomentETA", "MomentRTA", "MomentRTD", "MomentPTA"].includes(header))
          ];
        }
        return [
          index,
          ...row
          .map((cell, i) => cleanCell(cell, data[0][i])) // Verwerk elke cel in de rij
          .filter((_, i) => !["MomentETD", "MomentETA", "MomentRTA", "MomentRTD", "MomentPTA"].includes(data[0][i])) // Verwijder ongewenste kolommen
        ];
      });

      onUpload(updatedData, formattedDate);
    };
  };

  const renameHeader = (header) => {
    const mappings = {
      "OrderId": "Ordernr.",
      "SjOrderId": "Sjabloonnr.",
      "OrdSubTaskNo": "Taaknr.",
      "LocName": "Naam",
      "LocStreet": "Adres",
      "LocZip": "Postcode",
      "LocCity": "Plaats",
      "LocCountry": "Land",
      "LocContact": "Contact",
      "LocPhone": "Telefoonnummer",
      "LocMobile": "Mobiel",
    };
    return mappings[header] || header;
  };

  const cleanCell = (cell, columnName) => {
    if (cell === "NULL") return "";
    // Specifiek voor Telefoonnummer & Mobiel: verwijder apostrof en extra spaties
    if (typeof cell === "string" && columnName && ["LocPhone", "LocMobile"].includes(columnName)) {
        console.log(cell)
      return cell
        .replace(/^'+/, "") // Verwijder apostrof aan het begin
        .replace(/'+$/, "") // Verwijder apostrof aan het einde
        .trim(); // Verwijder extra spaties
    }
  
    return cell; // Laat andere cellen ongewijzigd
  };
  
  
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" className="mb-4" onChange={handleFileUpload} />
    </div>
  );
}
