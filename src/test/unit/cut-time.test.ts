import { isCutTimeValid } from "../../utils/cut-time";

describe("isCutTimeValid", () => {
  it("retorna true si la hora actual es anterior al horario de corte", () => {
    const monday = new Date("2025-02-10T10:00:00");
    const cutTimes = [
      "14:00",
      "18:00",
      "11:00",
      "15:00",
      "12:00",
      "16:00",
      "08:00",
    ];
    expect(isCutTimeValid(cutTimes, monday)).toBe(true);
  });

  it("retorna false si la hora actual es posterior al horario de corte", () => {
    const monday = new Date("2025-02-10T15:00:00");
    const cutTimes = [
      "14:00",
      "18:00",
      "11:00",
      "15:00",
      "12:00",
      "16:00",
      "08:00",
    ];
    expect(isCutTimeValid(cutTimes, monday)).toBe(false);
  });
});
