import type { Point } from "./world";
import { ELD_LIBRARY_ID } from "./eld-tutorial";
import { ELD_NPC_LIBRARIAN } from "./eld-content";

export const ELD_TOWN_MAP_ID = "eld-town";
export const ELD_LIBRARY_ENTRY_ANCHOR = [1504, 992] as const satisfies Point;
export const ELD_LIBRARY_TILE_SIZE = 64;
export const ELD_LIBRARY_GRID_SIZE = [10, 16] as const;
export const ELD_LIBRARY_PIXEL_SIZE = [640, 1024] as const;
export const ELD_LIBRARY_ENTRANCE_WIDTH = 128;

export type LibraryTilePoint = readonly [x: number, y: number];
export type LibraryTileRect = Readonly<{
  x: number;
  y: number;
  widthTiles: number;
  heightTiles: number;
}>;

export type LibraryVisitorRule =
  | { npcId: string; kind: "always" }
  | { npcId: string; kind: "time-window"; startMinute: number; endMinute: number }
  | { npcId: string; kind: "conditional-time-window"; startMinute: number; endMinute: number }
  | { npcId: string; kind: "low-frequency-time-window"; startMinute: number; endMinute: number };

export const ELD_LIBRARY_VISITOR_RULES: readonly LibraryVisitorRule[] = [
  { npcId: ELD_NPC_LIBRARIAN, kind: "always" },
  { npcId: "ELD-NPC-019", kind: "time-window", startMinute: 10 * 60, endMinute: 16 * 60 },
  { npcId: "ELD-NPC-020", kind: "conditional-time-window", startMinute: 16 * 60, endMinute: 17 * 60 },
  { npcId: "ELD-NPC-024", kind: "low-frequency-time-window", startMinute: 13 * 60, endMinute: 14 * 60 },
] as const;

export function confirmedLibraryOccupants(minuteOfDay: number): string[] {
  return ELD_LIBRARY_VISITOR_RULES.filter(rule => {
    if (rule.kind === "always") return true;
    if (rule.kind !== "time-window") return false;
    return minuteOfDay >= rule.startMinute && minuteOfDay < rule.endMinute;
  }).map(rule => rule.npcId);
}

export const ELD_LIBRARY_LAYOUT = {
  tileSize: ELD_LIBRARY_TILE_SIZE,
  gridWidth: ELD_LIBRARY_GRID_SIZE[0],
  gridHeight: ELD_LIBRARY_GRID_SIZE[1],
  pixelWidth: ELD_LIBRARY_PIXEL_SIZE[0],
  pixelHeight: ELD_LIBRARY_PIXEL_SIZE[1],
  entrance: {
    edge: "bottom",
    xTiles: [4, 5] as const,
    widthTiles: 2,
    width: ELD_LIBRARY_ENTRANCE_WIDTH,
  },
  playerSpawn: {
    anchor: "entrance-center-inside",
    pixelPosition: null,
  },
  librarianCounter: {
    rect: { x: 1, y: 12, widthTiles: 1, heightTiles: 3 } as LibraryTileRect,
    librarianTile: [0, 13] as const satisfies LibraryTilePoint,
    librarianFacing: "right",
  },
  basementStairs: {
    rect: { x: 0, y: 12, widthTiles: 1, heightTiles: 1 } as LibraryTileRect,
    blockedByLockedDoorAtGameStart: true,
  },
  shelves: {
    topWall: { x: 0, y: 0, widthTiles: 10, heightTiles: 1 } as LibraryTileRect,
    leftWall: { x: 0, y: 1, widthTiles: 1, heightTiles: 6 } as LibraryTileRect,
    rightWall: { x: 9, y: 1, widthTiles: 1, heightTiles: 5 } as LibraryTileRect,
    centralBack: { x: 3, y: 4, widthTiles: 5, heightTiles: 1 } as LibraryTileRect,
    centralFront: { x: 3, y: 7, widthTiles: 5, heightTiles: 1 } as LibraryTileRect,
    auxiliary: { x: 4, y: 10, widthTiles: 5, heightTiles: 1 } as LibraryTileRect,
  },
  readingDesk: {
    rect: { x: 5, y: 13, widthTiles: 4, heightTiles: 1 } as LibraryTileRect,
    stoolTiles: [
      [5, 12],
      [6, 12],
      [7, 12],
      [8, 12],
    ] as const satisfies readonly LibraryTilePoint[],
    seatedFacing: "down",
  },
  bookmarkLight: {
    tilePosition: [5, 13] as const satisfies LibraryTilePoint,
    investigationTile: [4, 13] as const satisfies LibraryTilePoint,
    investigationFacing: "right",
    pixelPosition: null,
  },
  bookEatingRatInvestigationPoint: {
    tilePosition: [1, 1] as const satisfies LibraryTilePoint,
    pixelPosition: null,
  },
  openingEvent: {
    sortingAnchors: [
      [8, 1],
      [5, 1],
      [2, 1],
      [3, 8],
    ] as const satisfies readonly LibraryTilePoint[],
    bookDiscoveryTile: [3, 5] as const satisfies LibraryTilePoint,
    bookTile: [3, 4] as const satisfies LibraryTilePoint,
    routeAroundCentralShelfColumn: 2,
  },
} as const;

export const ELD_LIBRARY_MAP = {
  id: ELD_LIBRARY_ID,
  separateInteriorMap: true,
  townEntryAnchor: ELD_LIBRARY_ENTRY_ANCHOR,
  interiorSize: ELD_LIBRARY_PIXEL_SIZE,
  interiorSpawn: ELD_LIBRARY_LAYOUT.playerSpawn,
  exitTrigger: null,
  bookmarkLightPosition: ELD_LIBRARY_LAYOUT.bookmarkLight.pixelPosition,
} as const;
