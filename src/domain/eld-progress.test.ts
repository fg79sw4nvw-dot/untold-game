import { describe, expect, it } from "vitest";
import { ConversationHistory } from "./conversation";
import { QuestTracker } from "./quests";
import { RecordBook } from "./records";
import { recordConversationSentence } from "./recording-flow";
import {
  BOOK_EATING_RAT_CLUE_SENTENCES,
  QUEST_BOOK_EATING_RAT,
} from "../data/eld-content";

describe("Eld conversation, record, and quest foundations", () => {
  it("keeps one NPC session and removes duplicate sentence text", () => {
    const history = new ConversationHistory();
    const sentence = BOOK_EATING_RAT_CLUE_SENTENCES[0];
    history.append("npc-a", [sentence, sentence]);
    expect(history.getLastSession()?.sentences).toHaveLength(1);
    history.append("npc-b", [BOOK_EATING_RAT_CLUE_SENTENCES[1]]);
    expect(history.getLastSession()?.npcId).toBe("npc-b");
    expect(history.getLastSession()?.sentences).toHaveLength(1);
  });

  it("activates only the clue attached to the saved sentence", () => {
    const book = new RecordBook();
    const sentence = BOOK_EATING_RAT_CLUE_SENTENCES[0];
    const [clueId] = sentence.clueIds;
    expect(clueId).toBeDefined();
    expect(book.clueCount(clueId!)).toBe(0);
    expect(recordConversationSentence(book, {
      sentence,
      sourceId: "npc-a",
      locationId: "eld",
      recordedAt: "spring-1-12:00",
    })).toBe(true);
    expect(book.clueCount(clueId!)).toBe(1);
  });

  it("tracks the confirmed quest lifecycle without inventing failure states", () => {
    const quests = new QuestTracker();
    expect(quests.status(QUEST_BOOK_EATING_RAT)).toBe("inactive");
    expect(quests.start(QUEST_BOOK_EATING_RAT)).toBe(true);
    expect(quests.status(QUEST_BOOK_EATING_RAT)).toBe("active");
    expect(quests.complete(QUEST_BOOK_EATING_RAT)).toBe(true);
    expect(quests.status(QUEST_BOOK_EATING_RAT)).toBe("completed");
  });
});
