import { ELD_LIBRARY_LAYOUT, type LibraryTilePoint } from "../data/eld-library";
import {
  BOOKMARK_AFTER_CARDIZATION_THOUGHT,
  BOOKMARK_AFTER_CARDIZATION_TO_THOUGHT_MS,
  BOOKMARK_AFTER_THOUGHT_TO_FREE_MS,
  BOOKMARK_FOUND_THOUGHT,
  BOOKMARK_THOUGHT_TO_CARDIZATION_MS,
  BOOK_RAT_EXIT_STOP_TO_CALL_MS,
  BOOK_RAT_TURN_TO_DIALOGUE_MS,
} from "../data/opening-sequence";
import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";
import { LibraryTutorialController } from "./library-tutorial-controller";

type DialogueLine = Readonly<{ speaker: string | null; text: string }>;

type TutorialLibraryView = {
  showLine(line: DialogueLine): Promise<void>;
  showBookmarkLight(): void;
  hideBookmarkLight(): void;
  setOpeningPhase(phase: string): void;
  faceToward(tile: LibraryTilePoint): void;
};

type CardizationPresenter = {
  show(definition: SpecifiedCardDefinition): void;
  hide(): void;
};

type Wait = (ms: number) => Promise<void>;

export class LibraryTutorialPresentation {
  constructor(
    private readonly flow: LibraryTutorialController,
    private readonly view: TutorialLibraryView,
    private readonly cardization: CardizationPresenter,
    private readonly wait: Wait,
  ) {}

  revealBookmarkLight(): boolean {
    if (!this.flow.shouldShowBookmarkLight()) return false;
    this.view.showBookmarkLight();
    return true;
  }

  async inspectBookmarkLight(): Promise<boolean> {
    if (!this.flow.beginBookmarkInspection()) return false;
    this.view.setOpeningPhase("bookmark-inspection");
    await this.view.showLine({ speaker: null, text: BOOKMARK_FOUND_THOUGHT });
    await this.wait(BOOKMARK_THOUGHT_TO_CARDIZATION_MS);

    const definition = this.flow.beginBookmarkCardization();
    if (!definition) return false;
    this.view.hideBookmarkLight();
    this.view.setOpeningPhase("bookmark-cardization");
    this.cardization.show(definition);
    return true;
  }

  async completeBookmarkCardization(): Promise<boolean> {
    if (!this.flow.markBookmarkCardizationComplete()) return false;
    this.cardization.hide();
    await this.wait(BOOKMARK_AFTER_CARDIZATION_TO_THOUGHT_MS);
    await this.view.showLine({ speaker: null, text: BOOKMARK_AFTER_CARDIZATION_THOUGHT });
    await this.wait(BOOKMARK_AFTER_THOUGHT_TO_FREE_MS);
    if (!this.flow.finishBookmarkTutorial()) return false;
    this.view.setOpeningPhase("free-library-after-bookmark");
    return true;
  }

  async attemptLibraryExit(): Promise<"allowed" | "blocked" | "book-rat-intro"> {
    const result = this.flow.attemptLibraryExit();
    if (result.allowed) return "allowed";

    if (result.message) {
      this.view.faceToward(ELD_LIBRARY_LAYOUT.bookmarkLight.tilePosition);
      await this.view.showLine({ speaker: null, text: result.message });
      return "blocked";
    }

    if (!result.triggerBookRatIntro) return "blocked";

    this.view.setOpeningPhase("book-rat-intro");
    await this.wait(BOOK_RAT_EXIT_STOP_TO_CALL_MS);
    const lines = this.flow.beginBookRatIntro();
    if (!lines) return "blocked";

    const [call, ...rest] = lines;
    if (call) await this.view.showLine(call);
    this.view.faceToward(ELD_LIBRARY_LAYOUT.librarianCounter.librarianTile);
    await this.wait(BOOK_RAT_TURN_TO_DIALOGUE_MS);
    for (const line of rest) await this.view.showLine(line);

    this.flow.finishBookRatIntro();
    this.view.setOpeningPhase("book-rat-intro-complete");
    return "book-rat-intro";
  }
}
