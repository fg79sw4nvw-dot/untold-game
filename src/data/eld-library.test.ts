import { describe, expect, it } from "vitest";
import {
  ELD_LIBRARY_ENTRY_ANCHOR,
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_MAP,
  ELD_LIBRARY_PIXEL_SIZE,
  confirmedLibraryOccupants,
} from "./eld-library";

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

  it("uses the confirmed 9x7, 64px-tile library dimensions", () => {
    expect(ELD_LIBRARY_PIXEL_SIZE).toEqual([576, 448]);
    expect(ELD_LIBRARY_MAP.interiorSize).toEqual([576, 448]);
    expect(ELD_LIBRARY_LAYOUT.gridWidth).toBe(9);
    expect(ELD_LIBRARY_LAYOUT.gridHeight).toBe(7);
    expect(ELD_LIBRARY_LAYOUT.tileSize).toBe(64);
    expect(ELD_LIBRARY_LAYOUT.entrance.width).toBe(128);
  });

  it("keeps only unresolved final pixel coordinates unset", () => {
    expect(ELD_LIBRARY_MAP.interiorSpawn.pixelPosition).toBeNull();
    expect(ELD_LIBRARY_MAP.exitTrigger).toBeNull();
    expect(ELD_LIBRARY_MAP.bookmarkLightPosition).toBeNull();
    expect(ELD_LIBRARY_LAYOUT.bookEatingRatInvestigationPoint.pixelPosition).toBeNull();
  });
});
