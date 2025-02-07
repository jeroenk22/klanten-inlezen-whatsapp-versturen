import * as XLSX from "xlsx";
import {
  HEADER_MAPPINGS,
  UNWANTED_COLUMNS,
  SPECIAL_CLEAN_COLUMNS,
} from "./constants";

export const processExcelFile = (file, onUpload) => {
  if (!file) return;

  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, {
      type: "binary",
      cellText: false,
      cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    enforceStringValues(sheet);

    let data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Formatteer MomentRTA datum
    const momentRTAIndex = data[0].indexOf("MomentRTA");
    const formattedDate =
      momentRTAIndex !== -1 ? formatDate(data[1]?.[momentRTAIndex]) : "";

    // Verwerk de data in aparte functies
    const updatedData = processSheetData(data);

    onUpload(updatedData, formattedDate);
  };
};

/**
 * Zorgt ervoor dat numerieke waarden als string worden opgeslagen om dataverlies te voorkomen.
 */
const enforceStringValues = (sheet) => {
  Object.keys(sheet).forEach((cell) => {
    if (sheet[cell] && sheet[cell].t === "n") {
      sheet[cell].z = "@";
      sheet[cell].t = "s";
      sheet[cell].v = String(sheet[cell].v);
    }
  });
};

/**
 * Verwerkt de Excel-sheet, hernoemt headers, verwijdert ongewenste kolommen en reinigt de cellen.
 */
const processSheetData = (data) => {
  return data.map((row, index) => {
    if (index === 0) {
      return [
        "#",
        ...row
          .map(renameHeader)
          .filter((header) => !UNWANTED_COLUMNS.includes(header)),
      ];
    }
    return [
      index,
      ...row
        .map((cell, i) => cleanCell(cell, data[0][i])) // Verwerk elke cel
        .filter((_, i) => !UNWANTED_COLUMNS.includes(data[0][i])), // Verwijder ongewenste kolommen
    ];
  });
};

/**
 * Hernoemt de headers volgens de mappings in `constants.js`.
 */
export const renameHeader = (header) => HEADER_MAPPINGS[header] || header;

/**
 * Reinigt celwaarden en zorgt ervoor dat telefoonnummers correct blijven.
 */
export const cleanCell = (cell, columnName) => {
  if (cell === "NULL") return "";
  if (
    typeof cell === "string" &&
    columnName &&
    SPECIAL_CLEAN_COLUMNS.includes(columnName)
  ) {
    return cell.replace(/^'+/, "").replace(/'+$/, "").trim();
  }
  return cell;
};

/**
 * Converteert een datumstring naar een geformatteerde datum in NL-stijl.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
