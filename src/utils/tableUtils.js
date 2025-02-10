import MobileInput from "../components/MobileInput";

export function renderCell(cell, rowIndex, cellIndex, handleInputChange) {
  if (cellIndex === 0) {
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
