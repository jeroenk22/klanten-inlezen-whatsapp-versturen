import React, { useState } from "react";
import Modal from "./Modal";
import ApprovedCustomersTable from "./ApprovedCustomersTable";
import Button from "./Button";
import Table from "./Table";
import MobileInput from "./MobileInput";
import { validateMobileNumber } from "../utils/validation";
import { copyInvalidNumbersToClipboard } from "../utils/clipboard";
import { formatDate } from "../utils/dateUtils";
import formatMobileNumber from "../utils/formatMobileNumber";
import { sendMessage } from "../utils/sendMessage";

export default function DataTable({
  data,
  titleDate,
  onInputChange,
  onCopy,
  onReset,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(data);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [message, setMessage] = useState(""); // ✅ Houd de boodschap bij

  const firstValidRow = updatedData
    .slice(1)
    .find((row) => row[14] && row[14] !== "Datum");
  const displayDate = firstValidRow
    ? formatDate(firstValidRow[14])
    : "Geen datum beschikbaar";

  const filteredData = data.map((row) =>
    row.filter((_, index) => data[0][index] !== "Datum")
  );

  const handleInputChange = (rowIndex, newValue) => {
    setUpdatedData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][11] = newValue;
      return newData;
    });
  };

  const approvedCustomers = updatedData
    .slice(1)
    .filter((row) => validateMobileNumber(row[11]))
    .map((row) => ({
      sjabloon: row[2] && row[2] !== "NULL" ? "✔" : "",
      naam: row[4],
      plaats: row[7],
      mobiel: row[11],
      datum: row[14] || "",
    }));

  const handleConfirm = async () => {
    if (filteredCustomers.length === 0) {
      alert("Geen klanten om een bericht naar te sturen.");
      return;
    }

    const encodedMessage = message;

    try {
      // Maak een array van promises (1 request per klant)
      const sendRequests = filteredCustomers.map((customer) =>
        sendMessage(encodedMessage, formatMobileNumber(customer.mobiel))
      );

      // Wacht tot alle berichten zijn verstuurd
      const responses = await Promise.all(sendRequests);

      // Maak een lijst van verzonden berichten
      const sentCustomersList = filteredCustomers
        .map(
          (customer) =>
            `${customer.naam}: ${formatMobileNumber(customer.mobiel)}`
        )
        .join("\n");

      alert(
        `Berichten succesvol verzonden naar ${filteredCustomers.length} klanten!\n\n${sentCustomersList}`
      );
      console.log("API Responses:", responses);
    } catch (error) {
      alert("Er is een fout opgetreden bij het verzenden van de berichten.");
      console.error(error);
    }
  };

  const renderCell = (cell, rowIndex, cellIndex) => {
    if (cellIndex === 11) {
      const actualRowIndex = rowIndex + 1;
      return (
        <MobileInput
          value={cell.value || cell}
          onChange={(newValue) => handleInputChange(actualRowIndex, newValue)}
        />
      );
    }
    return cell;
  };

  return (
    <div className="mt-4 border p-2">
      <h2 className="text-lg font-semibold">
        Mestklanten Eurofins {displayDate}
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
        data={filteredData}
        onInputChange={onInputChange}
        renderCell={renderCell}
        headerStyles={[{ width: "45px" }]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="WhatsApp bericht sturen"
        onConfirm={handleConfirm}
        footerButtons={[
          {
            text: "Sluiten",
            color: "bg-red-500",
            onClick: () => setIsModalOpen(false),
          },
          { text: "Bevestigen", color: "bg-green-500", onClick: handleConfirm },
        ]}
      >
        <ApprovedCustomersTable
          customers={approvedCustomers}
          onFilterChange={setFilteredCustomers}
          onMessageChange={setMessage} // ✅ Houd de boodschap bij
        />
      </Modal>
    </div>
  );
}
