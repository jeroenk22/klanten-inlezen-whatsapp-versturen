import React from "react";
import Table from "./Table";

export default function ApprovedCustomersTable({ customers }) {
  const formattedData = [
    ["Sjabloon", "Naam", "Plaats", "Mobiel"],
    ...customers.map((row) => [row.sjabloon, row.naam, row.plaats, row.mobiel]),
  ];

  // **Render cell-functie** om het groene vinkje correct uit te lijnen
  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 0) {
      // Eerste kolom "Sjabloon"
      return (
        <div className="flex justify-center items-center h-full">
          {cell ? (
            <span
              className="text-green-500 text-lg leading-none"
              style={{ display: "inline-block", height: "1rem" }}
            >
              ✔
            </span>
          ) : (
            ""
          )}
        </div>
      );
    }
    return cell; // Andere cellen
  };

  return (
    <Table
      data={formattedData}
      renderCell={renderCell}
      headerStyles={[
        { width: "92px" }, // Specifieke breedte voor "Sjabloon"
      ]}
    />
  );
}
