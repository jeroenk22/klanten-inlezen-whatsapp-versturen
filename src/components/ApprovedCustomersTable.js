import React, { useState, useEffect } from "react";
import Table from "./Table";
import Textarea from "./Textarea";
import { generateMessage } from "../utils/messageTemplate";

export default function ApprovedCustomersTable({ customers }) {
  const [message, setMessage] = useState("");

  // Gebruik de nieuwe template functie
  useEffect(() => {
    if (customers.length > 0) {
      const firstValidCustomer = customers.find((c) => c.datum);
      if (firstValidCustomer) {
        setMessage(generateMessage(firstValidCustomer.datum));
      }
    }
  }, [customers]); // Dit effect wordt opnieuw uitgevoerd als customers verandert

  // Zorg dat Datum beschikbaar blijft, maar filter het UIT de tabel
  const formattedData = customers.map(({ datum, ...rest }) => {
    return rest;
  });

  // Converteer data naar array-formaat voor `Table.js`
  const tableData = [
    ["Sjabloon", "Naam", "Plaats", "Mobiel"], // Headers zonder "Datum"
    ...formattedData.map(({ sjabloon, naam, plaats, mobiel }) => [
      sjabloon,
      naam,
      plaats,
      mobiel,
    ]),
  ];

  // Render cell-functie voor het groene vinkje in de "Sjabloon"-kolom
  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 0) {
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
    return cell; // Andere cellen blijven ongewijzigd
  };

  return (
    <div>
      {/* Hier blijft Datum beschikbaar, maar wordt het alleen gebruikt in het bericht */}
      <Textarea
        label="Te verzenden bericht"
        value={message}
        onChange={setMessage}
        placeholder="Type hier je bericht..."
      />

      {/* Datum wordt NIET weergegeven in de tabel */}
      <Table
        data={tableData}
        renderCell={renderCell}
        headerStyles={[
          { width: "92px" }, // Specifieke breedte voor "Sjabloon"
        ]}
      />
    </div>
  );
}
