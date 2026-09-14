import type { Point } from "./world";
import { ELD_LIBRARY_ID } from "./eld-tutorial";
import { ELD_NPC_LIBRARIAN } from "./eld-content";

export const ELD_TOWN_MAP_ID = "eld-town";
export const ELD_LIBRARY_ENTRY_ANCHOR = [1504, 992] as const satisfies Point;
export const ELD_LIBRARY_TILE_SIZE = 64;
export const ELD_LIBRARY_GRID_SIZE = [9, 7] as const;
export const ELD_LIBRARY_PIXEL_SIZE = [576, 448] as const;
export const ELD_LIBRARY_ENTRANCE_WIDTH = 128;

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
    alignment: "center",
    width: ELD_LIBRARY_ENTRANCE_WIDTH,
  },
  playerSpawn: {
    anchor: "entrance-center-inside",
    pixelPosition: null,
  },
  librarianCounter: {
    location: "immediately-left-of-entrance",
    widthTiles: 1,
    heightTiles: 2,
    librarianFacing: "right",
  },
  basementStairs: {
    location: "behind-librarian-counter",
    widthTiles: 1,
    heightTiles: 1,
    blockedByLockedDoorAtGameStart: true,
  },
  shelves: {
    topWallTiles: 9,
    leftWallTopTiles: 3,
    centralRows: 2,
    centralShelfWidthTiles: 4,
    centralRowGapPixels: 96,
    centralOffsetRightPixels: 32,
  },
  readingDesk: {
    location: "lower-right-wall",
    widthTiles: 3,
    stoolCount: 3,
    stoolSide: "above",
    seatedFacing: "down",
  },
  bookmarkLight: {
    location: "left-side-of-reading-desk",
    pixelPosition: null,
  },
  bookEatingRatInvestigationPoint: {
    location: "upper-left-floor-near-left-and-top-shelf-intersection",
    pixelPosition: null,
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
