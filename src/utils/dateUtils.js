/**
 * Converteert een datumstring naar een geformatteerde datum in NL-stijl.
 * Bijvoorbeeld: "vrijdag 7 februari 2025"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Ongeldige datum"; // Voorkomt fouten

  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Haalt de juiste begroeting op basis van het huidige tijdstip.
 * - Voor 12:00 → "Goedemorgen"
 * - Voor 17:00 → "Goedemiddag"
 * - Na 17:00 → "Goedenavond"
 */
export const getMomentGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Goedemorgen";
  if (currentHour < 17) return "Goedemiddag";
  return "Goedenavond";
};

/**
 * Converteert een MomentPTA naar een leesbare tekst voor berichten.
 * Geeft één van de volgende formaten terug:
 * - "vandaag"
 * - "morgen"
 * - "vrijdag 7 februari 2025" (lange notatie)
 * - "vrijdag (09-02)" (korte notatie)
 */
export const formatDateLabel = (momentPTA, shortFormat = false) => {
  if (!momentPTA) return "onbekende datum";

  const today = new Date();
  const datePTA = new Date(momentPTA);

  if (isNaN(datePTA.getTime())) return "onbekende datum";

  if (datePTA.toDateString() === today.toDateString()) return "vandaag";

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (datePTA.toDateString() === tomorrow.toDateString()) return "morgen";

  // Nieuwe korte notatie: "vrijdag (09-02)"
  if (shortFormat) {
    const day = String(datePTA.getDate()).padStart(2, "0");
    const month = String(datePTA.getMonth() + 1).padStart(2, "0"); // Maanden starten bij 0
    return `${datePTA.toLocaleDateString("nl-NL", {
      weekday: "long",
    })} (${day}-${month})`;
  }

  // Standaard lange notatie: "vrijdag 7 februari 2025"
  return datePTA.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};
