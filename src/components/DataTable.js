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
  const [updatedData, setUpdatedData] = useState(data);

  // Update de mobiele nummers in de data state
  const handleInputChange = (rowIndex, newValue) => {
    setUpdatedData((prevData) => {
      const newData = [...prevData]; // Maak een kopie van de huidige data
      newData[rowIndex][11] = newValue; // Werk de juiste rij en kolom bij
      return newData; // Return de nieuwe data
    });
  };

  // Filter goedgekeurde klanten met een geldig mobiel nummer
  const approvedCustomers = updatedData
    .slice(1)
    .filter((row) => validateMobileNumber(row[11]))
    .map((row) => ({
      sjabloon: row[2] && row[2] !== "NULL" ? "✔" : "",
      naam: row[4],
      plaats: row[7],
      mobiel: row[11],
    }));

  // **Nieuwe renderCell-functie** om cellen dynamisch weer te geven
  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 11) {
      // Alleen voor de Mobiel-kolom
      const actualRowIndex = rowIndex + 1; // +1 om de header rij te compenseren
      return (
        <MobileInput
          value={cell.value || cell}
          onChange={(newValue) => handleInputChange(actualRowIndex, newValue)} // Gebruik de juiste index
        />
      );
    }
    return cell; // Andere cellen worden ongewijzigd geretourneerd
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
        data={updatedData}
        renderCell={renderCell} // Geef de custom render functie mee
        headerStyles={[
          { width: "45px" }, // Specifieke breedte voor "#"
        ]}
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
