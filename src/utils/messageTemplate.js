import { formatDateLabel, getMomentGreeting } from "./dateUtils";

/**
 * Genereert een standaardbericht op basis van de datum.
 * @param {string} datum - De ongeformatteerde datum.
 * @returns {string} Het gegenereerde bericht.
 */
export const generateMessage = (datum) => {
  if (!datum) return ""; // Geen datum? Geen bericht.

  const moment = getMomentGreeting(); // Haal "Goedemorgen/Goedemiddag/Goedenavond" op
  const formattedDate = formatDateLabel(datum, true); // Gebruik KORTE notatie: "vrijdag (09-02)"

  // Controleer of het om vandaag of morgen gaat
  const today = new Date();
  const dateObj = new Date(datum);
  const isToday = dateObj.toDateString() === today.toDateString(); // Check of datum vandaag is
  const isTomorrow =
    dateObj.toDateString() ===
    new Date(today.setDate(today.getDate() + 1)).toDateString(); // Check of datum morgen is

  // Pas de berichttekst aan op basis van de datum
  let message;
  if (isToday) {
    message = `Hoeveel mestbakken/kratten heeft u vandaag?`;
  } else if (isTomorrow) {
    message = `Weet u al hoeveel mestbakken/kratten u morgen heeft?`;
  } else {
    message = `Weet u al hoeveel mestbakken/kratten u ${formattedDate} heeft?`; // Gebruik korte datum
  }

  return `${moment},\n\n${message}\n\nMet vriendelijke groet,\nMiedema Ophaaldienst.`;
};
