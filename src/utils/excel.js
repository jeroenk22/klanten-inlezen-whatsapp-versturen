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

    // Haal de index van de datumkolom op
    const dateColumnIndex = data[0].indexOf("MomentRTA");

    // Verwerk de ruwe data zonder te formatteren
    const updatedData = processSheetData(data, dateColumnIndex);

    onUpload(updatedData);
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
const processSheetData = (data, dateColumnIndex) => {
  // Ontvangt dateColumnIndex
  return data.map((row, index) => {
    if (index === 0) {
      return [
        "#",
        ...row
          .map(renameHeader)
          .filter((header) => !UNWANTED_COLUMNS.includes(header)),
        "Datum", // Zorg dat de header correct wordt hernoemd
      ];
    }
    return [
      index,
      ...row
        .map((cell, i) => cleanCell(cell, data[0][i])) // Verwerk elke cel
        .filter((_, i) => !UNWANTED_COLUMNS.includes(data[0][i])), // Verwijder ongewenste kolommen
      row[dateColumnIndex] || "", // Sla de ruwe datum op zonder formattering
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
