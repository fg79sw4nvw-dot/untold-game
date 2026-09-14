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

  it("uses the confirmed 10x16, 64px-tile library dimensions", () => {
    expect(ELD_LIBRARY_PIXEL_SIZE).toEqual([640, 1024]);
    expect(ELD_LIBRARY_MAP.interiorSize).toEqual([640, 1024]);
    expect(ELD_LIBRARY_LAYOUT.gridWidth).toBe(10);
    expect(ELD_LIBRARY_LAYOUT.gridHeight).toBe(16);
    expect(ELD_LIBRARY_LAYOUT.tileSize).toBe(64);
    expect(ELD_LIBRARY_LAYOUT.entrance.width).toBe(128);
    expect(ELD_LIBRARY_LAYOUT.entrance.xTiles).toEqual([4, 5]);
  });

  it("keeps the confirmed furniture footprint", () => {
    expect(ELD_LIBRARY_LAYOUT.shelves.topWall).toEqual({ x: 0, y: 0, widthTiles: 10, heightTiles: 1 });
    expect(ELD_LIBRARY_LAYOUT.shelves.leftWall).toEqual({ x: 0, y: 1, widthTiles: 1, heightTiles: 6 });
    expect(ELD_LIBRARY_LAYOUT.shelves.rightWall).toEqual({ x: 9, y: 1, widthTiles: 1, heightTiles: 5 });
    expect(ELD_LIBRARY_LAYOUT.shelves.centralBack).toEqual({ x: 3, y: 4, widthTiles: 5, heightTiles: 1 });
    expect(ELD_LIBRARY_LAYOUT.shelves.centralFront).toEqual({ x: 3, y: 7, widthTiles: 5, heightTiles: 1 });
    expect(ELD_LIBRARY_LAYOUT.shelves.auxiliary).toEqual({ x: 4, y: 10, widthTiles: 5, heightTiles: 1 });
    expect(ELD_LIBRARY_LAYOUT.librarianCounter.rect).toEqual({ x: 1, y: 12, widthTiles: 1, heightTiles: 3 });
    expect(ELD_LIBRARY_LAYOUT.basementStairs.rect).toEqual({ x: 0, y: 12, widthTiles: 1, heightTiles: 1 });
    expect(ELD_LIBRARY_LAYOUT.readingDesk.rect).toEqual({ x: 5, y: 13, widthTiles: 4, heightTiles: 1 });
    expect(ELD_LIBRARY_LAYOUT.readingDesk.stoolTiles).toHaveLength(4);
  });

  it("keeps the confirmed opening-event anchors", () => {
    expect(ELD_LIBRARY_LAYOUT.openingEvent.sortingAnchors).toEqual([
      [8, 1],
      [5, 1],
      [2, 1],
      [3, 8],
    ]);
    expect(ELD_LIBRARY_LAYOUT.openingEvent.routeAroundCentralShelfColumn).toBe(2);
    expect(ELD_LIBRARY_LAYOUT.openingEvent.bookDiscoveryTile).toEqual([3, 5]);
    expect(ELD_LIBRARY_LAYOUT.openingEvent.bookTile).toEqual([3, 4]);
  });

  it("keeps only unresolved final pixel coordinates unset", () => {
    expect(ELD_LIBRARY_MAP.interiorSpawn.pixelPosition).toBeNull();
    expect(ELD_LIBRARY_MAP.exitTrigger).toBeNull();
    expect(ELD_LIBRARY_MAP.bookmarkLightPosition).toBeNull();
    expect(ELD_LIBRARY_LAYOUT.bookEatingRatInvestigationPoint.pixelPosition).toBeNull();
  });
});
