export const validateMobileNumber = (number) => {
  if (!number) return false;

  // Stap 1: Verwijder alle spaties en streepjes vóór de validatie
  const numberString = String(number)
    .trim()
    .replace(/[\s-]+/g, "");

  // Stap 2: Controleer of het een geldig mobiel nummerformaat is
  const validFormats = [
    /^06\d{8}$/, // 06xxxxxxxx
    /^00316\d{8}$/, // 00316xxxxxxxx
    /^\+316\d{8}$/, // +316xxxxxxxx (zonder spatie na +31, want we strippen die nu vooraf)
  ];

  return validFormats.some((format) => format.test(numberString));
};
