import { describe, expect, it } from "vitest";
import { QUEST_BOOK_EATING_RAT } from "../data/eld-content";
import {
  CARD_NO_BOOK_EATING_RAT,
  CARD_NO_FORGOTTEN_BOOKMARK,
} from "../data/specified-card-definitions";
import { ConversationHistory } from "./conversation";
import type { EquipmentCard } from "./equipment";
import type { PocketEntry } from "./inventory";
import { ProgressState } from "./progress";
import { QuestTracker } from "./quests";
import { RecordBook } from "./records";
import {
  createSaveData,
  parseSaveData,
  restoreSaveData,
  SAVE_SCHEMA_VERSION,
  SaveDataError,
} from "./save-data";
import { SpecifiedCardCollection } from "./specified-cards";

describe("P0-2 versioned save data", () => {
  it("round-trips representative player-owned state through JSON", () => {
    const progress = new ProgressState();
    progress.set("eld-intro:book-acquired");

    const specifiedCards = new SpecifiedCardCollection();
    specifiedCards.acquire(CARD_NO_FORGOTTEN_BOOKMARK);
    specifiedCards.acquire(CARD_NO_BOOK_EATING_RAT);

    const quests = new QuestTracker();
    quests.start(QUEST_BOOK_EATING_RAT);
    quests.complete(QUEST_BOOK_EATING_RAT);

    const records = new RecordBook([
      {
        id: "record:no55-shadow",
        text: "閉館後、棚の奥で小さな影を見た。",
        sourceType: "npc",
        sourceId: "ELD-NPC-010",
        locationId: "eld-library",
        recordedAt: "spring-1 19:00",
        clueIds: ["book-eating-rat:small-living-shadow"],
        marks: [1],
      },
    ], [
      { id: "group:no55", name: "書喰い鼠", recordIds: ["record:no55-shadow"] },
    ]);

    const conversation = new ConversationHistory();
    conversation.open("ELD-NPC-010");
    conversation.append("ELD-NPC-010", [
      {
        id: "dialogue:no55-shadow",
        text: "閉館後、棚の奥で小さな影を見た。",
        clueIds: ["book-eating-rat:small-living-shadow"],
      },
    ]);

    const inventory: PocketEntry[] = [
      { definitionId: "item:honeyed-nut", category: "material", quantity: 2 },
      { instanceId: "food:001", definitionId: "food:test", category: "food" },
    ];

    const coat: EquipmentCard = {
      instanceId: "equipment:001",
      definitionId: "equipment:test-coat",
      category: "equipment",
      equipmentSlot: "wear",
    };

    const save = createSaveData({
      gameTime: { season: "autumn", day: 2, hour: 21, minute: 15 },
      progress,
      specifiedCards,
      quests,
      records,
      conversation,
      inventory,
      equipped: { wear: coat },
    }, "2026-09-16T00:00:00.000Z");

    const serialized = JSON.stringify(save);
    const parsed = parseSaveData(serialized);
    const restored = restoreSaveData(parsed);

    expect(parsed.schemaVersion).toBe(SAVE_SCHEMA_VERSION);
    expect(restored.clock.time).toEqual({ season: "autumn", day: 2, hour: 21, minute: 15 });
    expect(restored.progress.has("eld-intro:book-acquired")).toBe(true);
    expect(restored.specifiedCards.values()).toEqual([
      CARD_NO_FORGOTTEN_BOOKMARK,
      CARD_NO_BOOK_EATING_RAT,
    ]);
    expect(restored.quests.status(QUEST_BOOK_EATING_RAT)).toBe("completed");
    expect(restored.records.records[0]?.clueIds).toEqual(["book-eating-rat:small-living-shadow"]);
    expect(restored.records.groups[0]?.recordIds).toEqual(["record:no55-shadow"]);
    expect(restored.conversation.getLastSession()?.npcId).toBe("ELD-NPC-010");
    expect(restored.inventory).toEqual(inventory);
    expect(restored.equipped.wear).toEqual(coat);
  });

  it("rejects saves created by a newer unsupported schema", () => {
    const serialized = JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION + 1 });
    try {
      parseSaveData(serialized);
      throw new Error("Expected parseSaveData to reject newer schema");
    } catch (error) {
      expect(error).toBeInstanceOf(SaveDataError);
      expect((error as SaveDataError).code).toBe("unsupported-newer-version");
    }
  });

  it("rejects malformed JSON without mutating runtime state", () => {
    expect(() => parseSaveData("{not-json")).toThrow(SaveDataError);
  });
});
