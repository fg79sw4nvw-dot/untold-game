import { CONTENT_SCHEMA_VERSION } from "./content-model";
import { GameClock, type GameTime } from "./clock";
import {
  ConversationHistory,
  type ConversationRecallState,
} from "./conversation";
import type { Equipped, EquipmentCard, EquipmentSlot } from "./equipment";
import type { PocketEntry } from "./inventory";
import { ProgressState } from "./progress";
import { QuestTracker, type QuestStatus } from "./quests";
import { RecordBook, type RecordEntry, type RecordGroup } from "./records";
import { SpecifiedCardCollection } from "./specified-cards";

export const SAVE_SCHEMA_VERSION = 1 as const;

export type SavedQuestState = Readonly<{
  id: string;
  status: Exclude<QuestStatus, "inactive">;
}>;

export type SaveDataV1 = Readonly<{
  schemaVersion: typeof SAVE_SCHEMA_VERSION;
  contentSchemaVersion: number;
  savedAt: string;
  gameTime: GameTime;
  progressFlags: readonly string[];
  specifiedCards: readonly number[];
  quests: readonly SavedQuestState[];
  records: Readonly<{
    entries: readonly RecordEntry[];
    groups: readonly RecordGroup[];
  }>;
  conversationRecall: ConversationRecallState;
  inventory: readonly PocketEntry[];
  equipped: Readonly<Partial<Record<EquipmentSlot, EquipmentCard>>>;
}>;

export type SaveSourceState = Readonly<{
  gameTime: GameTime;
  progress: ProgressState;
  specifiedCards: SpecifiedCardCollection;
  quests: QuestTracker;
  records: RecordBook;
  conversation: ConversationHistory;
  inventory: readonly PocketEntry[];
  equipped: Equipped;
}>;

export type RestoredSaveState = Readonly<{
  clock: GameClock;
  progress: ProgressState;
  specifiedCards: SpecifiedCardCollection;
  quests: QuestTracker;
  records: RecordBook;
  conversation: ConversationHistory;
  inventory: PocketEntry[];
  equipped: Equipped;
}>;

export class SaveDataError extends Error {
  constructor(
    public readonly code: "invalid-save" | "unsupported-newer-version" | "missing-migration",
    message: string,
  ) {
    super(message);
  }
}

function cloneRecordEntry(entry: RecordEntry): RecordEntry {
  return {
    ...entry,
    clueIds: [...entry.clueIds],
    marks: [...entry.marks],
  };
}

function cloneRecordGroup(group: RecordGroup): RecordGroup {
  return { ...group, recordIds: [...group.recordIds] };
}

function clonePocketEntry(entry: PocketEntry): PocketEntry {
  return { ...entry };
}

function cloneEquipmentCard(card: EquipmentCard): EquipmentCard {
  return { ...card };
}

function cloneEquipped(equipped: Readonly<Partial<Record<EquipmentSlot, EquipmentCard>>>): Equipped {
  const result: Equipped = {};
  for (const slot of ["wear", "utility-1", "utility-2"] as const) {
    const card = equipped[slot];
    if (card) result[slot] = cloneEquipmentCard(card);
  }
  return result;
}

function cloneRecall(state: ConversationRecallState): ConversationRecallState {
  return {
    remainingMinutes: state.remainingMinutes,
    session: state.session
      ? {
          npcId: state.session.npcId,
          sentences: state.session.sentences.map(sentence => ({
            ...sentence,
            clueIds: [...sentence.clueIds],
          })),
        }
      : null,
  };
}

export function createSaveData(source: SaveSourceState, savedAt = new Date().toISOString()): SaveDataV1 {
  const quests = source.quests.entries()
    .filter((entry): entry is [string, Exclude<QuestStatus, "inactive">] => entry[1] !== "inactive")
    .map(([id, status]) => ({ id, status }));

  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentSchemaVersion: CONTENT_SCHEMA_VERSION,
    savedAt,
    gameTime: { ...source.gameTime },
    progressFlags: source.progress.values(),
    specifiedCards: source.specifiedCards.values(),
    quests,
    records: {
      entries: source.records.records.map(cloneRecordEntry),
      groups: source.records.groups.map(cloneRecordGroup),
    },
    conversationRecall: cloneRecall(source.conversation.saveRecallState()),
    inventory: source.inventory.map(clonePocketEntry),
    equipped: cloneEquipped(source.equipped),
  };
}

export function restoreSaveData(save: SaveDataV1): RestoredSaveState {
  const progress = new ProgressState();
  for (const id of save.progressFlags) progress.set(id);

  const specifiedCards = new SpecifiedCardCollection();
  for (const cardNo of save.specifiedCards) specifiedCards.acquire(cardNo);

  const quests = new QuestTracker();
  for (const { id, status } of save.quests) {
    quests.start(id);
    if (status === "completed") quests.complete(id);
  }

  const records = new RecordBook(
    save.records.entries.map(cloneRecordEntry),
    save.records.groups.map(cloneRecordGroup),
  );

  const conversation = new ConversationHistory();
  conversation.restoreRecallState(cloneRecall(save.conversationRecall));

  return {
    clock: new GameClock({ ...save.gameTime }),
    progress,
    specifiedCards,
    quests,
    records,
    conversation,
    inventory: save.inventory.map(clonePocketEntry),
    equipped: cloneEquipped(save.equipped),
  };
}

type SaveMigration = (value: unknown) => unknown;

// Future migrations are added as sequential n -> n+1 transforms. A migration
// must preserve player-owned state and explicitly remap any renamed stable IDs.
const SAVE_MIGRATIONS: Readonly<Record<number, SaveMigration>> = {};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSaveDataV1(value: unknown): value is SaveDataV1 {
  if (!isObject(value)) return false;
  return value.schemaVersion === SAVE_SCHEMA_VERSION
    && typeof value.contentSchemaVersion === "number"
    && typeof value.savedAt === "string"
    && isObject(value.gameTime)
    && Array.isArray(value.progressFlags)
    && Array.isArray(value.specifiedCards)
    && Array.isArray(value.quests)
    && isObject(value.records)
    && isObject(value.conversationRecall)
    && Array.isArray(value.inventory)
    && isObject(value.equipped);
}

export function migrateSaveData(value: unknown): SaveDataV1 {
  if (!isObject(value) || typeof value.schemaVersion !== "number") {
    throw new SaveDataError("invalid-save", "Save data does not contain a numeric schemaVersion.");
  }

  if (value.schemaVersion > SAVE_SCHEMA_VERSION) {
    throw new SaveDataError(
      "unsupported-newer-version",
      `Save schema ${value.schemaVersion} is newer than supported schema ${SAVE_SCHEMA_VERSION}.`,
    );
  }

  let current: unknown = value;
  let version = value.schemaVersion;
  while (version < SAVE_SCHEMA_VERSION) {
    const migrate = SAVE_MIGRATIONS[version];
    if (!migrate) {
      throw new SaveDataError("missing-migration", `Missing save migration ${version} -> ${version + 1}.`);
    }
    current = migrate(current);
    version += 1;
  }

  if (!isSaveDataV1(current)) {
    throw new SaveDataError("invalid-save", "Save data failed schema validation after migration.");
  }
  return current;
}

export function parseSaveData(serialized: string): SaveDataV1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    throw new SaveDataError("invalid-save", "Save data is not valid JSON.");
  }
  return migrateSaveData(parsed);
}
