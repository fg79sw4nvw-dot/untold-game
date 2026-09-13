import type { DialogueSentence } from "./conversation";
import { RecordBook, type RecordEntry } from "./records";

export type RecordSentenceInput = {
  sentence: DialogueSentence;
  sourceId: string;
  locationId: string;
  recordedAt: string;
};

export function isSentenceRecorded(book: RecordBook, sourceId: string, sentence: DialogueSentence): boolean {
  return book.records.some(record => record.sourceType === "npc" && record.sourceId === sourceId && record.text === sentence.text);
}

export function recordConversationSentence(book: RecordBook, input: RecordSentenceInput): boolean {
  if (isSentenceRecorded(book, input.sourceId, input.sentence)) return false;
  const entry: RecordEntry = {
    id: `npc:${input.sourceId}:${input.sentence.id}`,
    text: input.sentence.text,
    sourceType: "npc",
    sourceId: input.sourceId,
    locationId: input.locationId,
    recordedAt: input.recordedAt,
    clueIds: [...input.sentence.clueIds],
    marks: [],
  };
  return book.add(entry);
}
