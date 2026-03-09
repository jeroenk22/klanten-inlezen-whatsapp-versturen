import React, { useState, useMemo } from "react";

export default function Table({ data, renderCell, headerStyles = [] }) {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (colIndex) => {
    const direction =
      sortedColumn === colIndex && sortDirection === "asc" ? "desc" : "asc";
    setSortedColumn(colIndex);
    setSortDirection(direction);
  };

  const sortedData = useMemo(() => {
    if (!data || data.length === 0 || sortedColumn === null) return data;
    const rows = [...data.slice(1)].sort((a, b) => {
      const valA = a[sortedColumn]?.toString().toLowerCase() ?? "";
      const valB = b[sortedColumn]?.toString().toLowerCase() ?? "";
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return [data[0], ...rows];
  }, [data, sortedColumn, sortDirection]);

  if (!sortedData || sortedData.length === 0) return <p>Geen data beschikbaar.</p>;

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
      <thead>
        <tr>
          {sortedData[0].map((header, colIndex) => (
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
        {sortedData.slice(1).map((row, rowIndex) => (
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
