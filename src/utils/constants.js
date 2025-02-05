export const HEADER_MAPPINGS = {
    "OrderId": "Ordernr.",
    "SjOrderId": "Sjabloonnr.",
    "OrdSubTaskNo": "Taaknr.",
    "LocName": "Naam",
    "LocStreet": "Adres",
    "LocZip": "Postcode",
    "LocCity": "Plaats",
    "LocCountry": "Land",
    "LocContact": "Contact",
    "LocPhone": "Telefoonnummer",
    "LocMobile": "Mobiel",
  };
  
  export const UNWANTED_COLUMNS = ["MomentETD", "MomentETA", "MomentRTA", "MomentRTD", "MomentPTA","LocLocation"];
  
  export const SPECIAL_CLEAN_COLUMNS = ["LocPhone", "LocMobile"];