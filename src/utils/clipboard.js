import { validateMobileNumber } from "./validation";

export const copyInvalidNumbersToClipboard = (
  data,
  columnIndex,
  alertMessage
) => {
  const invalidNumbers = data
    .slice(1)
    .filter((row) => !validateMobileNumber(row[11]))
    .map((row) => row[columnIndex])
    .join("\n");

  navigator.clipboard.writeText(invalidNumbers).then(() => {
    alert(alertMessage);
  });
};

export const copyColumnToClipboard = (
  data,
  columnIndex,
  alertMessage = "Gegevens gekopieerd naar klembord!"
) => {
  const values = data
    .slice(1)
    .map((row) => row[columnIndex]?.value || row[columnIndex])
    .join("\n");

  navigator.clipboard.writeText(values).then(() => {
    alert(alertMessage);
  });
};
