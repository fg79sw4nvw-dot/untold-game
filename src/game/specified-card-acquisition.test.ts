import { describe, expect, it } from "vitest";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { SpecifiedCardAcquisition } from "./specified-card-acquisition";

describe("specified card acquisition", () => {
  it("acquires a confirmed card and returns its presentation data", () => {
    const cards = new SpecifiedCardCollection();
    const acquisition = new SpecifiedCardAcquisition(cards);

    const result = acquisition.acquire(1);

    expect(result.acquired).toBe(true);
    if (!result.acquired) return;
    expect(result.definition.number).toBe(1);
    expect(result.definition.name).toBe("忘れられた栞");
    expect(cards.has(1)).toBe(true);
  });

  it("does not acquire a specified card twice", () => {
    const acquisition = new SpecifiedCardAcquisition(new SpecifiedCardCollection());
    expect(acquisition.acquire(1).acquired).toBe(true);
    expect(acquisition.acquire(1)).toEqual({ acquired: false, reason: "already-acquired" });
  });

  it("does not invent undefined cards", () => {
    const acquisition = new SpecifiedCardAcquisition(new SpecifiedCardCollection());
    expect(acquisition.acquire(4)).toEqual({ acquired: false, reason: "unknown-card" });
  });
});
