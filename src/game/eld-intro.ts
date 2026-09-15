import {
  CARD_NO_FORGOTTEN_BOOKMARK,
  type SpecifiedCardDefinition,
} from "../data/specified-card-definitions";
import {
  BASEMENT_LOCKED_OBSERVATION,
  BOOKMARK_EXIT_NOTICE_THOUGHT,
  LIBRARIAN_REPEAT_BEFORE_BOOKMARK,
} from "../data/opening-sequence";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";
import { SpecifiedCardAcquisition } from "./specified-card-acquisition";

export const CARD_FORGOTTEN_BOOKMARK = CARD_NO_FORGOTTEN_BOOKMARK;
export const ELD_INTRO_BOOK_ACQUIRED = "eld-intro:book-acquired";

export type LibraryExitResult = {
  allowed: boolean;
  message?: string;
  triggerBookRatIntro?: boolean;
};

export class EldIntroFlow {
  private readonly acquisition: SpecifiedCardAcquisition;

  constructor(
    private readonly progress: ProgressState,
    private readonly cards: SpecifiedCardCollection,
  ) {
    this.acquisition = new SpecifiedCardAcquisition(cards);
  }

  markBookAcquired(): void {
    this.progress.set(ELD_INTRO_BOOK_ACQUIRED);
  }

  hasBook(): boolean {
    return this.progress.has(ELD_INTRO_BOOK_ACQUIRED);
  }

  shouldShowBookmarkLight(): boolean {
    return this.hasBook() && !this.cards.has(CARD_FORGOTTEN_BOOKMARK);
  }

  acquireBookmark(): SpecifiedCardDefinition | null {
    if (!this.shouldShowBookmarkLight()) return null;
    const result = this.acquisition.acquire(CARD_FORGOTTEN_BOOKMARK);
    return result.acquired ? result.definition : null;
  }

  inspectBookmarkLight(): boolean {
    return this.acquireBookmark() !== null;
  }

  librarianRepeatLine(): string | null {
    if (!this.hasBook() || this.cards.has(CARD_FORGOTTEN_BOOKMARK)) return null;
    return LIBRARIAN_REPEAT_BEFORE_BOOKMARK;
  }

  inspectBasementDoor(): string {
    return BASEMENT_LOCKED_OBSERVATION;
  }

  attemptLibraryExit(): LibraryExitResult {
    if (this.shouldShowBookmarkLight()) {
      return {
        allowed: false,
        message: BOOKMARK_EXIT_NOTICE_THOUGHT,
      };
    }

    if (this.cards.has(CARD_FORGOTTEN_BOOKMARK) && !this.progress.has(BOOK_RAT_INTRO_SEEN)) {
      return {
        allowed: false,
        triggerBookRatIntro: true,
      };
    }

    return { allowed: true };
  }
}
