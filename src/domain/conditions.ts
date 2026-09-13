import type { Season, TimeBand } from "./clock";
import type { PocketEntry } from "./inventory";
import type { RecordBook } from "./records";

export const MAX_SPECIFIED_CARD_CONDITIONS = 8;

export type ConditionContext = {
  records: RecordBook;
  locationId?: string;
  timeBand?: TimeBand;
  season?: Season;
  weather?: string;
  inventory?: readonly PocketEntry[];
  npcStates?: ReadonlySet<string>;
  eventStates?: ReadonlySet<string>;
  actions?: ReadonlySet<string>;
};

export type CardCondition =
  | { type: "clue"; id: string }
  | { type: "location"; id: string }
  | { type: "timeBand"; value: TimeBand }
  | { type: "season"; value: Season }
  | { type: "weather"; value: string }
  | { type: "item"; id: string }
  | { type: "npcState"; id: string }
  | { type: "eventState"; id: string }
  | { type: "action"; id: string };

export function evaluateCardConditions(conditions: readonly CardCondition[], context: ConditionContext): boolean {
  if (conditions.length > MAX_SPECIFIED_CARD_CONDITIONS) return false;
  return conditions.every(condition => {
    switch (condition.type) {
      case "clue": return context.records.clueCount(condition.id) > 0;
      case "location": return context.locationId === condition.id;
      case "timeBand": return context.timeBand === condition.value;
      case "season": return context.season === condition.value;
      case "weather": return context.weather === condition.value;
      case "item": return context.inventory?.some(entry => entry.definitionId === condition.id) ?? false;
      case "npcState": return context.npcStates?.has(condition.id) ?? false;
      case "eventState": return context.eventStates?.has(condition.id) ?? false;
      case "action": return context.actions?.has(condition.id) ?? false;
    }
  });
}
