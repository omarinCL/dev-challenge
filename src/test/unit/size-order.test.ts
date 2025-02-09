import { isSizeWithinRange } from "../../utils/size-order";

describe("isSizeWithinRange", () => {
  it("retorna true cuando el tamaño del producto está dentro del rango", () => {
    expect(isSizeWithinRange("M", "S", "XL")).toBe(true);
    expect(isSizeWithinRange("S", "S", "M")).toBe(true);
    expect(isSizeWithinRange("L", "M", "XL")).toBe(true);
  });

  it("retorna false cuando el tamaño del producto está fuera del rango", () => {
    expect(isSizeWithinRange("XL", "S", "L")).toBe(false);
    expect(isSizeWithinRange("S", "M", "XL")).toBe(false);
  });
});
