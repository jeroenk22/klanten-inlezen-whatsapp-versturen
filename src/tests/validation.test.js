import { validateMobileNumber } from "../utils/validation";

describe("validateMobileNumber", () => {
  describe("geldige nummers", () => {
    it("accepteert 06-formaat", () => {
      expect(validateMobileNumber("0612345678")).toBe(true);
    });

    it("accepteert +31-formaat", () => {
      expect(validateMobileNumber("+31612345678")).toBe(true);
    });

    it("accepteert 0031-formaat", () => {
      expect(validateMobileNumber("0031612345678")).toBe(true);
    });

    it("accepteert nummers met spaties (worden gestript)", () => {
      expect(validateMobileNumber("06 12 34 56 78")).toBe(true);
    });

    it("accepteert nummers met streepjes (worden gestript)", () => {
      expect(validateMobileNumber("06-12-34-56-78")).toBe(true);
    });
  });

  describe("ongeldige nummers", () => {
    it("weigert leeg", () => {
      expect(validateMobileNumber("")).toBe(false);
    });

    it("weigert null", () => {
      expect(validateMobileNumber(null)).toBe(false);
    });

    it("weigert undefined", () => {
      expect(validateMobileNumber(undefined)).toBe(false);
    });

    it("weigert vast nummer (010-formaat)", () => {
      expect(validateMobileNumber("0101234567")).toBe(false);
    });

    it("weigert te kort nummer", () => {
      expect(validateMobileNumber("061234")).toBe(false);
    });

    it("weigert nummer met letters", () => {
      expect(validateMobileNumber("06abcdefgh")).toBe(false);
    });

    it("weigert nummer zonder landcode in 0031-formaat (te kort)", () => {
      expect(validateMobileNumber("003161234")).toBe(false);
    });
  });
});
