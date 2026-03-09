import React, { useState } from "react";
import Modal from "./Modal";
import ApprovedCustomersTable from "./ApprovedCustomersTable";
import Button from "./Button";
import Table from "./Table";
import { validateMobileNumber } from "../utils/validation";
import { copyInvalidNumbersToClipboard } from "../utils/clipboard";
import { formatDate } from "../utils/dateUtils";
import formatMobileNumber from "../utils/formatMobileNumber";
import { sendMessage } from "../utils/sendMessage";
import { renderCell } from "../utils/tableUtils";

export default function DataTable({ data, onInputChange, onCopy, onReset }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(data);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const firstValidRow = updatedData
    .slice(1)
    .find((row) => row[14] && row[14] !== "Datum");
  const displayDate = firstValidRow
    ? formatDate(firstValidRow[14])
    : "Geen datum beschikbaar";

  const filteredData = updatedData.map((row) =>
    row.filter((_, index) => updatedData[0][index] !== "Datum")
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

    setIsLoading(true); // Zet de knop in de 'verzenden' status

    const encodedMessage = message;

    try {
      for (const customer of filteredCustomers) {
        await sendMessage(encodedMessage, formatMobileNumber(customer.mobiel));
        console.log(
          `Bericht verzonden naar ${customer.naam}: ${formatMobileNumber(
            customer.mobiel
          )}`
        );

        await new Promise((resolve) => setTimeout(resolve, 10000));
      }

      const sentCustomersList = filteredCustomers
        .map(
          (customer) =>
            `${customer.naam}: ${formatMobileNumber(customer.mobiel)}`
        )
        .join("\n");

      alert(
        `Berichten succesvol verzonden naar ${filteredCustomers.length} klanten!\n\n${sentCustomersList}`
      );
      setIsSent(true);
    } catch (error) {
      alert("Er is een fout opgetreden bij het verzenden van de berichten.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSent(false);
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
          color="bg-teal-500"
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
          color="bg-orange-500"
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
          color="bg-red-500"
        />
        <Button onClick={onReset} text="Reset" color="bg-gray-500" />
        <Button
          onClick={() => setIsModalOpen(true)}
          text="Stuur WhatsApp bericht"
          color="bg-green-500"
        />
      </div>

      <Table
        data={filteredData}
        onInputChange={onInputChange}
        renderCell={(cell, cellIndex, originalIndex) =>
          renderCell(cell, cellIndex, originalIndex, handleInputChange, "DataTable")
        }
        headerStyles={[{ width: "45px" }]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={!isLoading ? handleCloseModal : undefined}
        title="WhatsApp bericht sturen"
        onConfirm={handleConfirm}
        footerButtons={[
          {
            text: "Sluiten",
            color: `bg-red-500${isLoading ? " opacity-50 cursor-not-allowed" : ""}`,
            onClick: !isLoading ? handleCloseModal : undefined,
            disabled: isLoading,
          },
          ...(!isSent ? [{
            text: isLoading ? "Bezig met verzenden..." : "Verstuur",
            icon: isLoading ? undefined : "📨",
            color: "bg-green-500",
            onClick: handleConfirm,
            loading: isLoading,
          }] : []),
        ]}
      >
        <ApprovedCustomersTable
          customers={approvedCustomers}
          onFilterChange={setFilteredCustomers}
          onMessageChange={setMessage}
        />
      </Modal>
    </div>
  );
}
