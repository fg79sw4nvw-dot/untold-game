import { FIRST_RECORDING_THOUGHTS } from "../data/opening-sequence";
import { ProgressState } from "../domain/progress";
import { BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";

export const FIRST_RECORDING_COMPLETED = "opening:first-recording-completed";

export class FirstRecordingTutorial {
  constructor(private readonly progress: ProgressState) {}

  canBegin(): boolean {
    return this.progress.has(BOOK_RAT_INTRO_SEEN) && !this.progress.has(FIRST_RECORDING_COMPLETED);
  }

  thoughts(): readonly string[] {
    return FIRST_RECORDING_THOUGHTS;
  }

  shouldShowRecordButton(): boolean {
    return this.canBegin();
  }

  shouldHighlightRecordButton(): boolean {
    return this.canBegin();
  }

  locksNormalOperations(): boolean {
    return this.canBegin();
  }

  complete(): boolean {
    if (!this.canBegin()) return false;
    this.progress.set(FIRST_RECORDING_COMPLETED);
    return true;
  }

  isCompleted(): boolean {
    return this.progress.has(FIRST_RECORDING_COMPLETED);
  }
}
