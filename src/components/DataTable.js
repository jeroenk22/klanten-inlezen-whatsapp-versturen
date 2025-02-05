import React, { useState } from "react";
import Modal from "./Modal";
import ApprovedCustomersTable from "./ApprovedCustomersTable";

export default function DataTable({ data, titleDate, onInputChange, onCopy, onReset}) {
  const [sortedColumn, setSortedColumn] = useState(null); // Huidige gesorteerde kolom
  const [sortDirection, setSortDirection] = useState(null); // 'asc' of 'desc'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateMobileNumber = (number) => {
    if (!number) return false; // Voorkomt fouten bij null of undefined
  
    const numberString = String(number).trim().replace(/\s+/g, ""); // Verwijder alle spaties
  
    const validFormats = [
      /^06\d{8}$/,        // 06xxxxxxxx
      /^00316\d{8}$/,     // 00316xxxxxxxx
      /^\+316\d{8}$/,     // +316xxxxxxxx
      /^\+31\s?6\d{8}$/   // +31 6xxxxxxxx (optionele spatie na +31)
    ];
  
    return validFormats.some((format) => format.test(numberString));
  };

    // Filter goedgekeurde klanten met een geldig mobiel nummer
    const approvedCustomers = data.slice(1)
    .filter((row) => validateMobileNumber(row[11]))
    .map((row) => ({
      sjabloon: row[2] && row[2] !== "NULL" ? "✔" : "", // Zet hier het vinkje
      naam: row[4],
      mobiel: row[11]
    }));
  

  const handleSort = (colIndex) => {
    const direction = sortedColumn === colIndex && sortDirection === "asc" ? "desc" : "asc";
    setSortedColumn(colIndex);
    setSortDirection(direction);

    const sortedData = [...data.slice(1)].sort((a, b) => {
      const aValue = a[colIndex] || "";
      const bValue = b[colIndex] || "";
      if (direction === "asc") {
        return aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
      }
      return bValue.toString().localeCompare(aValue.toString(), undefined, { numeric: true });
    });

    data.splice(1, data.length - 1, ...sortedData); // Vervang de originele data
  };

  const copyInvalidOrderNumbers = () => {
    const invalidOrderNumbers = data
      .slice(1)
      .filter((row) => !validateMobileNumber(row[11])) // Controleer of er een waarde is
      .map((row) => row[1]) // Ordernummers ophalen
      .join("\n");
  
    navigator.clipboard.writeText(invalidOrderNumbers).then(() => {
      alert("Ordernummers met foutieve mobiele nummers gekopieerd naar klembord!");
    });
  };
  

  const copyInvalidMobileNumbers = () => {
    const invalidSjabloonnrs = data
      .slice(1)
      .filter((row) => !validateMobileNumber(row[11]))
      .map((row) => row[2])
      .join("\n");

    navigator.clipboard.writeText(invalidSjabloonnrs).then(() => {
      alert("Sjabloonnrs met foutieve mobiele nummers gekopieerd naar klembord!");
    });
  };

  return (
    <div className="mt-4 border p-2">
      <h2 className="text-lg font-semibold">Mestklanten Eurofins {titleDate}</h2>

      <div className="mb-2">
        <button className="mr-2 p-2 bg-blue-500 text-white rounded" onClick={() => onCopy(1)}>
            Kopieer Ordernrs
        </button>
        <button className="mr-2 p-2 bg-green-500 text-white rounded" onClick={() => onCopy(2)}>
            Kopieer Sjabloonnrs
        </button>
        <button className="mr-2 p-2 bg-yellow-500 text-white rounded" onClick={() => onCopy(3)}>
            Kopieer Taaknrs
        </button>
        <button className="mr-2 p-2 bg-red-500 text-white rounded" onClick={copyInvalidOrderNumbers}>
            Kopieer Ordernrs met foutief mobiel nummer
        </button>
        <button className="mr-2 p-2 bg-red-600 text-white rounded" onClick={copyInvalidMobileNumbers}>
            Kopieer Sjabloonnrs met foutief mobiel nummer
        </button>
        <button className="mr-2 p-2 bg-gray-500 text-white rounded" onClick={onReset}>
          Reset
        </button>
        <button className="p-2 bg-green-600 text-white rounded" onClick={() => setIsModalOpen(true)}>
          Open WhatsApp Modal
        </button>
    </div>


      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
          <tr>
            {data[0].map((header, colIndex) => (
              <th
                key={colIndex}
                className="border border-gray-300 px-2 py-1 text-left bg-gray-200 cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort(colIndex)}
              >
                {header}{" "}
                {sortedColumn === colIndex && (
                  <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-gray-300 px-2 py-1">
                  {cellIndex === 11 ? ( // Mobiel kolom (index 11) als inputveld tonen
                    <input
                      type="text"
                      value={cell.value || cell}
                      className={`w-full border px-1 ${
                        validateMobileNumber(cell.value || cell) ? "border-green-500" : "border-red-500"
                      }`}
                      onChange={(e) => onInputChange(rowIndex + 1, e.target.value)}
                    />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gebruik de generieke Modal en injecteer de tabel als children */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gekwalificeerde Klanten">
        <ApprovedCustomersTable customers={approvedCustomers} />
      </Modal>
    </div>
  );
}
