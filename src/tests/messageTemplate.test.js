import { generateMessage } from "../utils/messageTemplate";

describe("generateMessage", () => {
  it("geeft lege string terug bij geen datum", () => {
    expect(generateMessage("")).toBe("");
    expect(generateMessage(null)).toBe("");
    expect(generateMessage(undefined)).toBe("");
  });

  it("bevat aanhef en afsluiting", () => {
    const datum = new Date();
    datum.setDate(datum.getDate() + 7); // een week vooruit
    const result = generateMessage(datum.toISOString());

    expect(result).toMatch(/Goedemorgen|Goedemiddag|Goedenavond/);
    expect(result).toContain("Met vriendelijke groet,");
    expect(result).toContain("Miedema Ophaaldienst.");
  });

  it("gebruikt 'vandaag' als datum vandaag is", () => {
    const today = new Date().toISOString();
    const result = generateMessage(today);
    expect(result).toContain("vandaag");
  });

  it("gebruikt 'morgen' als datum morgen is", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const result = generateMessage(tomorrow.toISOString());
    expect(result).toContain("morgen");
  });

  it("bevat datum voor toekomstige datum", () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    const result = generateMessage(future.toISOString());
    expect(result).toContain("mestbakken/kratten");
  });
});
