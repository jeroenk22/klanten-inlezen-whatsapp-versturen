import MobileInput from "../components/MobileInput";
import formatMobileNumber from "../utils/formatMobileNumber";

export function renderCell(
  cell,
  cellIndex,
  originalIndex,
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

  // Voor DataTable: Rij-index tonen in de eerste kolom (stabiel na sorteren)
  if (tableType === "DataTable" && cellIndex === 0) {
    return originalIndex;
  }

  // Voor DataTable: MobileInput tonen in kolom 11
  if (tableType === "DataTable" && cellIndex === 11) {
    return (
      <MobileInput
        value={cell.value || cell}
        onChange={(newValue) => handleInputChange(originalIndex, newValue)}
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
