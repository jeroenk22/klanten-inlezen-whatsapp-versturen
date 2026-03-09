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

  // sortedRows: [{ row, originalIndex }] — originalIndex is 1-based (skips header)
  const sortedRows = useMemo(() => {
    if (!data || data.length === 0) return [];
    const indexed = data.slice(1).map((row, i) => ({ row, originalIndex: i + 1 }));
    if (sortedColumn === null) return indexed;
    return [...indexed].sort((a, b) => {
      const valA = a.row[sortedColumn]?.toString().toLowerCase() ?? "";
      const valB = b.row[sortedColumn]?.toString().toLowerCase() ?? "";
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortedColumn, sortDirection]);

  if (!data || data.length === 0) return <p>Geen data beschikbaar.</p>;

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
        {sortedRows.map(({ row, originalIndex }, displayIndex) => (
          <tr key={originalIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border border-gray-300 px-2 py-1">
                {renderCell ? renderCell(cell, cellIndex, originalIndex) : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
