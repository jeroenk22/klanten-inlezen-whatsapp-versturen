import React, { useState, useEffect, useMemo, useRef } from "react";
import Table from "./Table";
import Textarea from "./Textarea";
import { FilterButtons } from "../components/FilterButtons";
import { generateMessage } from "../utils/messageTemplate";
import { renderCell, formatTableData } from "../utils/tableUtils";

const toTrimmedString = (value) => String(value ?? "").trim();

export default function ApprovedCustomersTable({
  customers,
  onFilterChange,
  onMessageChange,
}) {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("templates");
  const isUserEditing = useRef(false);
  const prevFilteredCustomers = useRef([]);

  useEffect(() => {
    if (!isUserEditing.current) {
      const firstValidCustomer = customers.find(
        (c) => toTrimmedString(c.datum) !== "",
      );
      if (firstValidCustomer) {
        // generateMessage kan prima overweg met Date/strings omdat het new Date(datum) doet
        const initialMessage = generateMessage(firstValidCustomer.datum);
        setMessage(initialMessage);
        onMessageChange?.(initialMessage);
      }
    }
  }, [customers, onMessageChange]);

  const handleMessageChange = (newMessage) => {
    isUserEditing.current = true;
    setMessage(newMessage);
    onMessageChange?.(newMessage);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      if (filter === "templates") return customer.sjabloon;
      if (filter === "orders") return !customer.sjabloon;
      return true;
    });
  }, [customers, filter]);

  useEffect(() => {
    if (
      onFilterChange &&
      JSON.stringify(prevFilteredCustomers.current) !==
        JSON.stringify(filteredCustomers)
    ) {
      onFilterChange(filteredCustomers);
      prevFilteredCustomers.current = filteredCustomers;
    }
  }, [filteredCustomers, onFilterChange]);

  return (
    <div className="flex flex-col h-full">
      <MessageInput value={message} onChange={handleMessageChange} />
      <FilterButtons filter={filter} setFilter={setFilter} />
      <CustomerTable customers={filteredCustomers} />
    </div>
  );
}

function MessageInput({ value, onChange }) {
  return (
    <Textarea
      label="Te verzenden bericht"
      value={value}
      onChange={onChange}
      placeholder="Type hier je bericht..."
    />
  );
}

function CustomerTable({ customers }) {
  const tableData = useMemo(
    () => formatTableData(customers, ["Sjabloon", "Naam", "Plaats", "Mobiel"]),
    [customers],
  );

  return (
    <Table
      data={tableData}
      renderCell={(cell, rowIndex, cellIndex) =>
        renderCell(cell, rowIndex, cellIndex, null, "ApprovedCustomersTable")
      }
      headerStyles={[{ width: "92px" }]}
    />
  );
}
