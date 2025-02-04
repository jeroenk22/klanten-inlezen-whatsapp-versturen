import React from "react";

export default function DataTable({ data, titleDate, onInputChange, onCopy }) {
  const validateMobileNumber = (number) => {
    const validFormats = [
      /^06\d{8}$/, // 06xxxxxxxx
      /^00316\d{8}$/, // 00316xxxxxxxx
      /^\+316\d{8}$/ // +316xxxxxxxx
    ];
    return validFormats.some((format) => format.test(number.trim()));
  };

  const copyInvalidOrderNumbers = () => {
    const invalidOrderNumbers = data
      .slice(1) // Sla de header over
      .filter((row) => !validateMobileNumber(row[11])) // Controleer of mobiel nummer ongeldig is
      .map((row) => row[1]) // Haal de OrderId's op (index 0)
      .join("\n"); // Zet ze om in een string gescheiden door nieuwe regels

    navigator.clipboard.writeText(invalidOrderNumbers).then(() => {
      alert("Ordernummers met foutieve mobiele nummers gekopieerd naar klembord!");
    });
  };

  const copyInvalidMobileNumbers = () => {
    const invalidSjabloonnrs = data
      .slice(1) // Sla de header over
      .filter((row) => !validateMobileNumber(row[11])) // Controleer of mobiel nummer ongeldig is
      .map((row) => row[2]) // Haal de SjOrderId's op (index 1)
      .join("\n"); // Zet ze om in een string gescheiden door nieuwe regels

    navigator.clipboard.writeText(invalidSjabloonnrs).then(() => {
      alert("Sjabloonnrs met foutieve mobiele nummers gekopieerd naar klembord!");
    });
  };

  return (
    <div className="mt-4 border p-2">
      <h2 className="text-lg font-semibold">Mestmonsters Eurofins {titleDate}</h2>

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
        <button className="p-2 bg-red-600 text-white rounded" onClick={copyInvalidOrderNumbers}>
          Kopieer Ordernrs met foutief mobiel nummer
        </button>
        <button className="mr-2 p-2 bg-red-500 text-white rounded" onClick={copyInvalidMobileNumbers}>
          Kopieer Sjabloonnrs met foutief mobiel nummer
        </button>
      </div>

      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
          <tr>
            {data[0].map((header, index) => (
              <th key={index} className="border border-gray-300 px-2 py-1 text-left bg-gray-200">
                {header}
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
    </div>
  );
}
