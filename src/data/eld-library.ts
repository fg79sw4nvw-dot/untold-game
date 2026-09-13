import type { Point } from "./world";
import { ELD_LIBRARY_ID } from "./eld-tutorial";
import { ELD_NPC_LIBRARIAN } from "./eld-content";

export const ELD_TOWN_MAP_ID = "eld-town";
export const ELD_LIBRARY_ENTRY_ANCHOR = [1504, 992] as const satisfies Point;

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

export const ELD_LIBRARY_MAP = {
  id: ELD_LIBRARY_ID,
  separateInteriorMap: true,
  townEntryAnchor: ELD_LIBRARY_ENTRY_ANCHOR,
  interiorSize: null,
  interiorSpawn: null,
  exitTrigger: null,
  bookmarkLightPosition: null,
} as const;
