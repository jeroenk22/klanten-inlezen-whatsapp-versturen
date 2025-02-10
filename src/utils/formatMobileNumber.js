const formatMobileNumber = (number) => {
  if (!number) return ""; // Voorkom errors bij lege input

  // Spaties en niet-numerieke tekens verwijderen
  const cleanedNumber = number.replace(/\D+/g, "");

  // Controleren of het nummer begint met '06', '00316' of '+316'
  if (cleanedNumber.startsWith("06")) {
    return `+31${cleanedNumber.slice(1)}`;
  } else if (cleanedNumber.startsWith("316")) {
    return `+${cleanedNumber}`;
  } else if (cleanedNumber.startsWith("00316")) {
    return `+31${cleanedNumber.slice(4)}`;
  }

  return ""; // Ongeldig nummer → lege string
};

export default formatMobileNumber;
