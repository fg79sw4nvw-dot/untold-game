import {
  BOOK_RAT_INTRO_TO_FIRST_RECORDING_THOUGHT_MS,
  FIRST_RECORD_COMPLETE_TO_LIST_MS,
  FIRST_RECORD_FINAL_THOUGHT_TO_FREE_MS,
  FIRST_RECORD_LIST_CLOSE_TO_THOUGHT_MS,
  FIRST_RECORDING_COMPLETE_THOUGHT,
  FIRST_RECORDING_THOUGHTS,
} from "../data/opening-sequence";
import { FirstRecordingSession } from "./first-recording-session";
import { LibraryInteractionState } from "./library-interaction-state";

type DialogueLine = Readonly<{ speaker: string | null; text: string }>;

type FirstRecordingView = {
  showLine(line: DialogueLine): Promise<void>;
  showRecordControl(): void;
  hideRecordControl(): void;
  openRecordList(): void;
};

type Wait = (ms: number) => Promise<void>;

export class FirstRecordingPresentation {
  constructor(
    private readonly session: FirstRecordingSession,
    private readonly view: FirstRecordingView,
    private readonly interactionState: LibraryInteractionState,
    private readonly wait: Wait,
  ) {}

  async begin(): Promise<boolean> {
    if (!this.session.canRecord()) return false;
    this.interactionState.setPhase("first-recording-thoughts");
    await this.wait(BOOK_RAT_INTRO_TO_FIRST_RECORDING_THOUGHT_MS);

    for (const thought of FIRST_RECORDING_THOUGHTS) {
      await this.view.showLine({ speaker: null, text: thought });
    }

    this.interactionState.setPhase("first-recording-awaiting-selection");
    this.view.showRecordControl();
    return true;
  }

  async commitFixedRecord(recordedAt: string): Promise<boolean> {
    if (!this.session.recordFixedTarget(recordedAt)) return false;
    this.view.hideRecordControl();
    this.interactionState.setPhase("first-recording-saved");
    await this.wait(FIRST_RECORD_COMPLETE_TO_LIST_MS);
    this.view.openRecordList();
    this.interactionState.setPhase("first-recording-review");
    return true;
  }

  async finishRecordListReview(): Promise<boolean> {
    await this.wait(FIRST_RECORD_LIST_CLOSE_TO_THOUGHT_MS);
    await this.view.showLine({ speaker: null, text: FIRST_RECORDING_COMPLETE_THOUGHT });
    await this.wait(FIRST_RECORD_FINAL_THOUGHT_TO_FREE_MS);
    if (!this.session.completeTutorial()) return false;
    this.interactionState.setPhase("free-library-after-first-recording");
    return true;
  }
}
