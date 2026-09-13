import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";

export const CARD_FORGOTTEN_BOOKMARK = 1;
export const ELD_INTRO_BOOK_ACQUIRED = "eld-intro:book-acquired";

export type LibraryExitResult = {
  allowed: boolean;
  message?: string;
};

export class EldIntroFlow {
  constructor(
    private readonly progress: ProgressState,
    private readonly cards: SpecifiedCardCollection,
  ) {}

  markBookAcquired(): void {
    this.progress.set(ELD_INTRO_BOOK_ACQUIRED);
  }

  shouldShowBookmarkLight(): boolean {
    return this.progress.has(ELD_INTRO_BOOK_ACQUIRED) && !this.cards.has(CARD_FORGOTTEN_BOOKMARK);
  }

  inspectBookmarkLight(): boolean {
    if (!this.shouldShowBookmarkLight()) return false;
    return this.cards.acquire(CARD_FORGOTTEN_BOOKMARK);
  }

  attemptLibraryExit(): LibraryExitResult {
    if (this.shouldShowBookmarkLight()) {
      return {
        allowed: false,
        message: "なにか見落としている気がする",
      };
    }
    return { allowed: true };
  }
}
