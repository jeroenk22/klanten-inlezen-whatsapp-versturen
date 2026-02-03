import * as XLSX from "xlsx";
import {
  HEADER_MAPPINGS,
  UNWANTED_COLUMNS,
  SPECIAL_CLEAN_COLUMNS,
  ORIGINAL_HEADERS,
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

    const normalizeHeader = (h) => String(h ?? "").trim();

    // --- bestaande strikte check (blijft intact) ---
    const validateHeadersRow = (row) => {
      const headers = (row || []).map(normalizeHeader);
      const expected = ORIGINAL_HEADERS;

      if (headers.length !== expected.length) {
        return {
          ok: false,
          reason: `Aantal kolommen klopt niet (gevonden ${headers.length}, verwacht ${expected.length}).`,
          found: headers,
        };
      }

      for (let i = 0; i < expected.length; i++) {
        if (headers[i] !== expected[i]) {
          return {
            ok: false,
            reason: `Header mismatch op kolom ${i + 1}: gevonden "${headers[i]}", verwacht "${expected[i]}".`,
            found: headers,
          };
        }
      }

      return { ok: true };
    };

    const assertHeadersOnFirstRow = (data) => {
      const result = validateHeadersRow(data?.[0]);
      if (result.ok) return;

      const message =
        `❌ Excel header-check mislukt.\n\n` +
        `De headers moeten op rij 1 staan en exact overeenkomen met de verwachte kolommen.\n\n` +
        `${result.reason}\n\n` +
        `Gevonden headers (rij 1):\n${(result.found || []).join(", ")}`;

      throw new Error(message);
    };

    // --- NEW: ondersteun ook headers op rij 2 of ontbrekende headers ---
    const rowsMatchHeaders = (row) => validateHeadersRow(row).ok;

    const looksLikeDataRow = (dataRow) => {
      // Heuristiek: eerste cel is vaak OrderId-achtig nummer als headers ontbreken
      const first = dataRow?.[0];
      const firstIsNumberLike =
        typeof first === "number" || /^\d+$/.test(String(first ?? "").trim());

      // Als rij strings bevat die lijken op de verwachte headers, dan is het géén data-rij
      const rowAsString = (dataRow || [])
        .map((v) => String(v ?? "").trim())
        .join("|");
      const containsAnyExpectedHeader = ORIGINAL_HEADERS.some((h) =>
        rowAsString.includes(h),
      );

      return firstIsNumberLike && !containsAnyExpectedHeader;
    };

    const ensureHeaders = (rawData) => {
      if (!rawData || rawData.length === 0) {
        throw new Error("❌ Het Excelbestand bevat geen data.");
      }

      // Case 1: headers correct op rij 1 (bestaand gedrag)
      if (rowsMatchHeaders(rawData[0])) {
        return { data: rawData, info: null };
      }

      // Case 2: headers op rij 2 → rij 1 overslaan
      if (rawData[1] && rowsMatchHeaders(rawData[1])) {
        return {
          data: [rawData[1], ...rawData.slice(2)],
          info: "ℹ️ Headers stonden op rij 2. Rij 1 is overgeslagen.",
        };
      }

      // Case 3: headers ontbreken → voeg ORIGINAL_HEADERS toe als rij 1
      if (looksLikeDataRow(rawData[0])) {
        return {
          data: [ORIGINAL_HEADERS, ...rawData],
          info: "ℹ️ Headers ontbraken. Verwachte headers zijn automatisch toegevoegd op rij 1.",
        };
      }

      // Case 4: onbekend formaat → hard fail, met gevonden rij 1
      const found = (rawData[0] || []).map((x) => String(x ?? "").trim());
      const message =
        `❌ Excel header-check mislukt.\n\n` +
        `Ik verwacht:\n` +
        `- headers op rij 1, of\n` +
        `- headers op rij 2, of\n` +
        `- géén headers waarbij rij 1 meteen data is.\n\n` +
        `Dit bestand past daar niet in.\n\n` +
        `Gevonden rij 1:\n${found.join(", ")}`;

      throw new Error(message);
    };

    let data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // NEW: maak data "veilig" voor de rest van je bestaande processing
    try {
      const result = ensureHeaders(data);
      data = result.data;

      // Optioneel: alleen melding als we echt moesten corrigeren
      if (result.info) alert(result.info);

      // Houd de originele strikte check als extra zekerheid (rij 1 is nu altijd correct)
      assertHeadersOnFirstRow(data);
    } catch (err) {
      alert(err.message);
      return; // stop: React gaat niet verder met verwerken
    }

    // Haal de index van de datumkolom op (bestaand gedrag)
    const dateColumnIndex = data[0].indexOf("MomentRTA");

    // Verwerk de ruwe data zonder te formatteren (bestaand gedrag)
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
  return data.map((row, index) => {
    if (index === 0) {
      return [
        "#",
        ...row
          .map(renameHeader)
          .filter((header) => !UNWANTED_COLUMNS.includes(header)),
        "Datum",
      ];
    }
    return [
      index,
      ...row
        .map((cell, i) => cleanCell(cell, data[0][i]))
        .filter((_, i) => !UNWANTED_COLUMNS.includes(data[0][i])),
      row[dateColumnIndex] || "",
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
