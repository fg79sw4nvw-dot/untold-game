import { describe, expect, it } from "vitest";
import { ProgressState } from "../domain/progress";
import { BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";
import { FirstRecordingTutorial } from "./first-recording-tutorial";

describe("first recording tutorial", () => {
  it("appears only after the No.55 intro and locks normal operations until one recording completes", () => {
    const progress = new ProgressState();
    const tutorial = new FirstRecordingTutorial(progress);

    expect(tutorial.canBegin()).toBe(false);
    expect(tutorial.shouldShowRecordButton()).toBe(false);

    progress.set(BOOK_RAT_INTRO_SEEN);
    expect(tutorial.canBegin()).toBe(true);
    expect(tutorial.shouldShowRecordButton()).toBe(true);
    expect(tutorial.shouldHighlightRecordButton()).toBe(true);
    expect(tutorial.locksNormalOperations()).toBe(true);
    expect(tutorial.thoughts()).toEqual([
      "（そういえば……あの本に、気になったことを書き留めておけるって書いてあったな。）",
      "（でも、どうやって……？）",
    ]);

    expect(tutorial.complete()).toBe(true);
    expect(tutorial.isCompleted()).toBe(true);
    expect(tutorial.shouldShowRecordButton()).toBe(false);
    expect(tutorial.locksNormalOperations()).toBe(false);
    expect(tutorial.complete()).toBe(false);
  });
});
