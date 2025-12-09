export const HEADER_MAPPINGS = {
  OrderId: "Ordernr.",
  SjOrderId: "Sjabloonnr.",
  OrdSubTaskNo: "Taaknr.",
  LocName: "Naam",
  LocStreet: "Adres",
  LocZip: "Postcode",
  LocCity: "Plaats",
  LocCountry: "Land",
  LocContact: "Contact",
  LocPhone: "Telefoonnummer",
  LocMobile: "Mobiel",
  ColliDescription: "Verpakking",
};

export const UNWANTED_COLUMNS = [
  "MomentETD",
  "MomentETA",
  "MomentRTA",
  "MomentRTD",
  "MomentPTA",
  "LocLocation",
];

export const SPECIAL_CLEAN_COLUMNS = ["LocPhone", "LocMobile"];

export const API_URL =
  "https://whatsapp-backend-proxy.vercel.app/api/send-message";

export const API_TOKEN = "aP7xF2mQ9vS5kD1rT8jW4nC6bE0hG3uY2qL9tV7pR5oM1cN";
