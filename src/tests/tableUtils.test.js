import { formatTableData } from "../utils/tableUtils";

describe("formatTableData", () => {
  const customers = [
    { sjabloon: "✔", naam: "Jan Jansen", plaats: "Utrecht", mobiel: "0612345678" },
    { sjabloon: "", naam: "Piet Pietersen", plaats: "Leiden", mobiel: "0698765432" },
  ];

  it("plaatst headers als eerste rij", () => {
    const result = formatTableData(customers, ["Sjabloon", "Naam", "Plaats", "Mobiel"]);
    expect(result[0]).toEqual(["Sjabloon", "Naam", "Plaats", "Mobiel"]);
  });

  it("bevat evenveel rijen als klanten plus één headerrij", () => {
    const result = formatTableData(customers, ["Sjabloon", "Naam", "Plaats", "Mobiel"]);
    expect(result).toHaveLength(customers.length + 1);
  });

  it("zet naam correct in tweede kolom", () => {
    const result = formatTableData(customers, ["Sjabloon", "Naam", "Plaats", "Mobiel"]);
    expect(result[1][1]).toBe("Jan Jansen");
    expect(result[2][1]).toBe("Piet Pietersen");
  });

  it("formatteert mobiel nummer naar +31-formaat", () => {
    const result = formatTableData(customers, ["Sjabloon", "Naam", "Plaats", "Mobiel"]);
    expect(result[1][3]).toBe("+31612345678");
  });
});
