import { ELD_NPC_LIBRARIAN, LIBRARIAN_AFTER_BOOKMARK } from "../data/eld-content";
import { ELD_LIBRARY_ID } from "../data/eld-tutorial";
import { RecordBook } from "../domain/records";
import { recordConversationSentence } from "../domain/recording-flow";
import { FirstRecordingTutorial } from "./first-recording-tutorial";

export const FIRST_RECORDING_TARGET_INDEX = 1;

export class FirstRecordingSession {
  constructor(
    private readonly tutorial: FirstRecordingTutorial,
    private readonly records: RecordBook,
  ) {}

  targetSentence() {
    return LIBRARIAN_AFTER_BOOKMARK[FIRST_RECORDING_TARGET_INDEX];
  }

  canRecord(): boolean {
    return this.tutorial.canBegin();
  }

  recordFixedTarget(recordedAt: string): boolean {
    if (!this.canRecord()) return false;
    const sentence = this.targetSentence();
    if (!sentence) return false;
    return recordConversationSentence(this.records, {
      sentence,
      sourceId: ELD_NPC_LIBRARIAN,
      locationId: ELD_LIBRARY_ID,
      recordedAt,
    });
  }

  completeTutorial(): boolean {
    return this.tutorial.complete();
  }
}
