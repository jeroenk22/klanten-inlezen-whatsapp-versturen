import React, { useState } from "react";
import Modal from "./Modal";
import ApprovedCustomersTable from "./ApprovedCustomersTable";
import Button from "./Button";
import Table from "./Table";
import MobileInput from "./MobileInput";
import { validateMobileNumber } from "../utils/validation";
import { copyInvalidNumbersToClipboard } from "../utils/clipboard";

export default function DataTable({
  data,
  titleDate,
  onInputChange,
  onCopy,
  onReset,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter goedgekeurde klanten met een geldig mobiel nummer
  const approvedCustomers = data
    .slice(1)
    .filter((row) => validateMobileNumber(row[11]))
    .map((row) => ({
      sjabloon: row[2] && row[2] !== "NULL" ? "✔" : "",
      naam: row[4],
      mobiel: row[11],
    }));

  // **Nieuwe renderCell-functie** om cellen dynamisch weer te geven
  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 11) {
      // Alleen voor de Mobiel-kolom (index 11)
      return (
        <MobileInput
          value={cell.value || cell}
          onChange={(newValue) => onInputChange(rowIndex + 1, newValue)}
        />
      );
    }
    return cell;
  };

  return (
    <div className="mt-4 border p-2">
      <h2 className="text-lg font-semibold">
        Mestklanten Eurofins {titleDate}
      </h2>

      <div className="mb-2">
        <Button
          onClick={() => onCopy(1)}
          text="Kopieer Ordernrs"
          color="bg-blue-500"
        />
        <Button
          onClick={() => onCopy(2)}
          text="Kopieer Sjabloonnrs"
          color="bg-green-500"
        />
        <Button
          onClick={() => onCopy(3)}
          text="Kopieer Taaknrs"
          color="bg-yellow-500"
        />
        <Button
          onClick={() =>
            copyInvalidNumbersToClipboard(
              data,
              1,
              "Ordernummers met foutieve mobiele nummers gekopieerd naar klembord!"
            )
          }
          text="Kopieer Ordernrs met foutief mobiel nummer"
          color="bg-red-500"
        />
        <Button
          onClick={() =>
            copyInvalidNumbersToClipboard(
              data,
              2,
              "Sjabloonnrs met foutieve mobiele nummers gekopieerd naar klembord!"
            )
          }
          text="Kopieer Sjabloonnrs met foutief mobiel nummer"
          color="bg-red-600"
        />
        <Button onClick={onReset} text="Reset" color="bg-gray-500" />
        <Button
          onClick={() => setIsModalOpen(true)}
          text="Open WhatsApp Modal"
          color="bg-green-600"
        />
      </div>

      <Table
        data={data}
        renderCell={renderCell} // Geef de custom render functie mee
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gekwalificeerde Klanten"
      >
        <ApprovedCustomersTable customers={approvedCustomers} />
      </Modal>
    </div>
  );
}
