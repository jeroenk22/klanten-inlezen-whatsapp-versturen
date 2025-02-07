import React, { useState, useEffect } from "react";
import Table from "./Table";
import Textarea from "./Textarea";
import Button from "./Button";
import { generateMessage } from "../utils/messageTemplate";

export default function ApprovedCustomersTable({ customers }) {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "templates", "orders"

  // Zoek de eerste beschikbare datum om het standaardbericht te genereren
  useEffect(() => {
    const firstValidCustomer = customers.find(
      (c) => c.datum && c.datum.trim() !== ""
    );
    if (firstValidCustomer) {
      setMessage(generateMessage(firstValidCustomer.datum));
    }
  }, [customers]);

  // Filter de klantenlijst op basis van de geselecteerde optie
  const filteredCustomers = customers.filter((customer) => {
    if (filter === "templates") return customer.sjabloon; // Alleen sjablonen (met een waarde)
    if (filter === "orders") return !customer.sjabloon; // Alleen losse orders (zonder sjabloon)
    return true; // Standaard: Toon alle klanten
  });

  // Verwijder de "datum"-kolom uit de tabel, maar behoud deze voor het bericht
  const formattedData = filteredCustomers.map(({ datum, ...rest }) => rest);

  // Zet de gefilterde data om naar een tabelstructuur
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
    <div className="flex flex-col h-full">
      {/* Berichttextarea */}
      <Textarea
        label="Te verzenden bericht"
        value={message}
        onChange={setMessage}
        placeholder="Type hier je bericht..."
      />

      {/* Scrollbare tabelcontainer met vaste hoogte */}
      <div className="flex-grow overflow-y-auto max-h-[60vh] border-b">
        <Table
          data={tableData}
          renderCell={renderCell}
          headerStyles={[
            { width: "92px" }, // Specifieke breedte voor "Sjabloon"
          ]}
        />
      </div>

      {/* Filters onder de tabel, vastgezet onderaan */}
      <div className="mt-2 flex justify-center gap-2 border-t pt-2 bg-white sticky bottom-0 p-3">
        <Button
          text="Alle"
          color={filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"}
          onClick={() => setFilter("all")}
        />
        <Button
          text="Alleen sjablonen"
          color={
            filter === "templates" ? "bg-blue-500 text-white" : "bg-gray-300"
          }
          onClick={() => setFilter("templates")}
        />
        <Button
          text="Alleen losse orders"
          color={filter === "orders" ? "bg-blue-500 text-white" : "bg-gray-300"}
          onClick={() => setFilter("orders")}
        />
      </div>
    </div>
  );
}
