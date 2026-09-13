import { describe, expect, it } from "vitest";
import { ELD_LIBRARY_ENTRY_ANCHOR, ELD_LIBRARY_MAP, confirmedLibraryOccupants } from "./eld-library";

describe("confirmed Eld library data", () => {
  it("keeps the confirmed town entry anchor", () => {
    expect(ELD_LIBRARY_ENTRY_ANCHOR).toEqual([1504, 992]);
  });

  it("includes the librarian at all times and the young man only from 10:00 to 16:00", () => {
    expect(confirmedLibraryOccupants(9 * 60)).toEqual(["ELD-NPC-010"]);
    expect(confirmedLibraryOccupants(10 * 60)).toEqual(["ELD-NPC-010", "ELD-NPC-019"]);
    expect(confirmedLibraryOccupants(15 * 60 + 59)).toEqual(["ELD-NPC-010", "ELD-NPC-019"]);
    expect(confirmedLibraryOccupants(16 * 60)).toEqual(["ELD-NPC-010"]);
  });

  it("does not invent unresolved interior coordinates", () => {
    expect(ELD_LIBRARY_MAP.interiorSize).toBeNull();
    expect(ELD_LIBRARY_MAP.interiorSpawn).toBeNull();
    expect(ELD_LIBRARY_MAP.exitTrigger).toBeNull();
    expect(ELD_LIBRARY_MAP.bookmarkLightPosition).toBeNull();
  });
});
