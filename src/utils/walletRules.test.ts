import { describe, expect, it } from "vitest";
import { getDoneRewardDelta } from "./walletRules";

describe("getDoneRewardDelta", () => {
  it("dà +2 quando si passa da TODO a DONE", () => {
    expect(getDoneRewardDelta("TODO", "DONE")).toBe(2);
  });

  it("non dà crediti se non si entra in DONE", () => {
    expect(getDoneRewardDelta("TODO", "DOING")).toBe(0);
  });

  it("non dà crediti se era già DONE", () => {
    expect(getDoneRewardDelta("DONE", "DONE")).toBe(0);
    expect(getDoneRewardDelta("DONE", "TODO")).toBe(0);
  });
});
