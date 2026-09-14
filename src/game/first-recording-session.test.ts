import { describe, expect, it } from "vitest";
import { ELD_NPC_LIBRARIAN } from "../data/eld-content";
import { ELD_LIBRARY_ID } from "../data/eld-tutorial";
import { ProgressState } from "../domain/progress";
import { RecordBook } from "../domain/records";
import { BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";
import { FirstRecordingSession } from "./first-recording-session";
import { FirstRecordingTutorial } from "./first-recording-tutorial";

describe("first recording session", () => {
  it("records only the confirmed fixed librarian sentence and preserves supplied record time", () => {
    const progress = new ProgressState();
    const records = new RecordBook();
    const tutorial = new FirstRecordingTutorial(progress);
    const session = new FirstRecordingSession(tutorial, records);

    expect(session.recordFixedTarget("spring-1-12:00")).toBe(false);
    progress.set(BOOK_RAT_INTRO_SEEN);

    expect(session.targetSentence()?.text).toBe("最近、閉館したあとに、本棚が荒らされてることがあって。");
    expect(session.recordFixedTarget("provided-by-clock")).toBe(true);
    expect(records.records).toHaveLength(1);
    expect(records.records[0]).toMatchObject({
      text: "最近、閉館したあとに、本棚が荒らされてることがあって。",
      sourceType: "npc",
      sourceId: ELD_NPC_LIBRARIAN,
      locationId: ELD_LIBRARY_ID,
      recordedAt: "provided-by-clock",
    });
    expect(session.recordFixedTarget("provided-by-clock")).toBe(false);
  });
});
