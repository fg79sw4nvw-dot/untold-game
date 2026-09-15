import {
  BOOK_EATING_RAT_CLUE_SENTENCES,
  BOOK_EATING_RAT_CLUE_SOURCES,
  CLUE_BOOK_EATING_RAT_BAIT,
  CLUE_BOOK_EATING_RAT_PAPER,
  CLUE_BOOK_EATING_RAT_SHADOW,
  ELD_NPC_ANTIQUE_DEALER,
  ELD_NPC_EAST_YOUTH,
  ELD_NPC_LIBRARIAN,
  ITEM_HONEYED_NUT,
  QUEST_BOOK_EATING_RAT,
} from "./eld-content";
import { ELD_LIBRARY_ID } from "./eld-tutorial";
import {
  CARD_NO_BOOK_EATING_RAT,
  CARD_NO_FORGOTTEN_BOOKMARK,
} from "./specified-card-definitions";
import {
  CONTENT_SCHEMA_VERSION,
  ContentRegistry,
  contentRef,
  specifiedCardRef,
  type ContentDefinition,
} from "../domain/content-model";

const clueIds = [
  CLUE_BOOK_EATING_RAT_SHADOW,
  CLUE_BOOK_EATING_RAT_PAPER,
  CLUE_BOOK_EATING_RAT_BAIT,
] as const;

const npcIds = [
  ELD_NPC_LIBRARIAN,
  ELD_NPC_EAST_YOUTH,
  ELD_NPC_ANTIQUE_DEALER,
] as const;

const baseDefinitions: ContentDefinition[] = [
  {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "specifiedCard",
    id: specifiedCardRef(CARD_NO_FORGOTTEN_BOOKMARK).id,
    refs: [],
  },
  {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "specifiedCard",
    id: specifiedCardRef(CARD_NO_BOOK_EATING_RAT).id,
    refs: [{ role: "quest", target: contentRef("quest", QUEST_BOOK_EATING_RAT) }],
  },
  {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "quest",
    id: QUEST_BOOK_EATING_RAT,
    refs: [
      { role: "specified-card", target: specifiedCardRef(CARD_NO_BOOK_EATING_RAT) },
      { role: "location", target: contentRef("location", ELD_LIBRARY_ID) },
    ],
  },
  {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "location",
    id: ELD_LIBRARY_ID,
    refs: [],
  },
  {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "item",
    id: ITEM_HONEYED_NUT,
    refs: [{ role: "quest", target: contentRef("quest", QUEST_BOOK_EATING_RAT) }],
  },
  ...npcIds.map((id): ContentDefinition<"npc"> => ({
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "npc",
    id,
    refs: [],
  })),
  ...clueIds.map((id): ContentDefinition<"clue"> => ({
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "clue",
    id,
    refs: [{ role: "quest", target: contentRef("quest", QUEST_BOOK_EATING_RAT) }],
  })),
  ...BOOK_EATING_RAT_CLUE_SENTENCES.map((sentence, index): ContentDefinition<"dialogue"> => ({
    schemaVersion: CONTENT_SCHEMA_VERSION,
    kind: "dialogue",
    id: sentence.id,
    refs: [
      {
        role: "speaker",
        target: contentRef("npc", BOOK_EATING_RAT_CLUE_SOURCES[sentence.id]),
      },
      {
        role: "quest",
        target: contentRef("quest", QUEST_BOOK_EATING_RAT),
      },
      {
        role: "clue",
        target: contentRef("clue", clueIds[index]),
      },
    ],
  })),
];

export const IMPLEMENTED_CONTENT_DEFINITIONS: readonly ContentDefinition[] = baseDefinitions;
export const IMPLEMENTED_CONTENT_REGISTRY = new ContentRegistry(IMPLEMENTED_CONTENT_DEFINITIONS);
