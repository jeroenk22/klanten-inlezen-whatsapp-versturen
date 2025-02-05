import { validateMobileNumber } from "./validation"; // Zorg ervoor dat we de validatie hergebruiken

export const copyInvalidNumbersToClipboard = (data, columnIndex, alertMessage) => {
  const invalidNumbers = data
    .slice(1)
    .filter((row) => !validateMobileNumber(row[11])) // Controleer op foutieve mobiele nummers
    .map((row) => row[columnIndex]) // Pak de juiste kolom (1 = OrderId, 2 = SjabloonId)
    .join("\n");

  navigator.clipboard.writeText(invalidNumbers).then(() => {
    alert(alertMessage);
  });
};