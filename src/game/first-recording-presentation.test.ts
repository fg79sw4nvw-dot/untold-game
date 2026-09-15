import { describe, expect, it, vi } from "vitest";
import { ProgressState } from "../domain/progress";
import { RecordBook } from "../domain/records";
import { BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";
import { FirstRecordingPresentation } from "./first-recording-presentation";
import { FirstRecordingSession } from "./first-recording-session";
import { FirstRecordingTutorial } from "./first-recording-tutorial";
import { LibraryInteractionState } from "./library-interaction-state";

describe("first recording tutorial presentation", () => {
  it("runs the confirmed sequence around the unresolved record-selection UI", async () => {
    const progress = new ProgressState();
    progress.set(BOOK_RAT_INTRO_SEEN);
    const tutorial = new FirstRecordingTutorial(progress);
    const records = new RecordBook();
    const session = new FirstRecordingSession(tutorial, records);
    const interactionState = new LibraryInteractionState();
    const calls: string[] = [];
    const view = {
      showLine: vi.fn(async ({ text }: { text: string }) => { calls.push(`line:${text}`); }),
      showRecordControl: vi.fn(() => { calls.push("record:show"); }),
      hideRecordControl: vi.fn(() => { calls.push("record:hide"); }),
      openRecordList: vi.fn(() => { calls.push("records:open"); }),
    };
    const wait = vi.fn(async (ms: number) => { calls.push(`wait:${ms}`); });
    const presentation = new FirstRecordingPresentation(session, view, interactionState, wait);

    expect(await presentation.begin()).toBe(true);
    expect(calls).toContain("wait:500");
    expect(calls).toContain("record:show");
    expect(interactionState.currentPhase()).toBe("first-recording-awaiting-selection");

    expect(await presentation.commitFixedRecord("clock-value")).toBe(true);
    expect(records.records[0]?.text).toBe("最近、閉館したあとに、本棚が荒らされてることがあって。");
    expect(calls).toContain("wait:300");
    expect(calls).toContain("records:open");
    expect(interactionState.currentPhase()).toBe("first-recording-review");

    expect(await presentation.finishRecordListReview()).toBe(true);
    expect(calls).toContain("wait:500");
    expect(calls).toContain("line:（……これが、書き留めるってことか。）");
    expect(tutorial.isCompleted()).toBe(true);
    expect(interactionState.currentPhase()).toBe("free-library-after-first-recording");
    expect(interactionState.allowsFreeRoam()).toBe(true);
  });
});
