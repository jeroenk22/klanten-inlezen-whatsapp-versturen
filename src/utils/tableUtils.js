import MobileInput from "../components/MobileInput";
import formatMobileNumber from "../utils/formatMobileNumber";

export function renderCell(
  cell,
  rowIndex,
  cellIndex,
  handleInputChange,
  tableType
) {
  // Voor ApprovedCustomersTable: Vinkje tonen in de eerste kolom
  if (tableType === "ApprovedCustomersTable" && cellIndex === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        {cell ? (
          <span className="text-green-500 text-lg leading-none">✔</span>
        ) : (
          ""
        )}
      </div>
    );
  }

  // Voor DataTable: Rij-index tonen in de eerste kolom
  if (tableType === "DataTable" && cellIndex === 0) {
    return rowIndex + 1; // 1-based indexering
  }

  // Voor DataTable: MobileInput tonen in kolom 11
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
}

export function formatTableData(customers, headers) {
  return [
    headers,
    ...customers.map(({ sjabloon, naam, plaats, mobiel }) => [
      sjabloon,
      naam,
      plaats,
      formatMobileNumber(mobiel),
    ]),
  ];
}
