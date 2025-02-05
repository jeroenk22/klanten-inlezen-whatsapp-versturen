import React from "react";
import Table from "./Table";

export default function ApprovedCustomersTable({ customers }) {
  const formattedData = [
    ["Sjabloon", "Naam", "Mobiel"], 
    ...customers.map((row) => [row.sjabloon, row.naam, row.mobiel])
  ];

  // **Render cell-functie** om het groene vinkje correct uit te lijnen
  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 0) { // Eerste kolom "Sjabloon"
      return cell ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-green-500 text-lg">✔</span>
        </div>
      ) : (
        ""
      );
    }
    return cell;
  };

  return <Table data={formattedData} renderCell={renderCell} />;
}  