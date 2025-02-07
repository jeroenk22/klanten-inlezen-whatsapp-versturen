import React, { useState } from "react";

export default function Table({ data, renderCell, headerStyles = [] }) {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  if (!data || data.length === 0) return <p>Geen data beschikbaar.</p>;

  const handleSort = (colIndex) => {
    const direction =
      sortedColumn === colIndex && sortDirection === "asc" ? "desc" : "asc";
    setSortedColumn(colIndex);
    setSortDirection(direction);

    const sortedData = [...data.slice(1)].sort((a, b) => {
      const valA = a[colIndex] ? a[colIndex].toString().toLowerCase() : "";
      const valB = b[colIndex] ? b[colIndex].toString().toLowerCase() : "";

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    data.splice(1, data.length - 1, ...sortedData);
  };

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
      <thead>
        <tr>
          {data[0].map((header, colIndex) => (
            <th
              key={colIndex}
              className="border border-gray-300 px-2 py-1 text-left bg-gray-200 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort(colIndex)}
              style={headerStyles[colIndex]}
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
                {renderCell ? renderCell(cell, rowIndex, cellIndex) : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
