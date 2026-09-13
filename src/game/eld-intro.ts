import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { SpecifiedCardAcquisition } from "./specified-card-acquisition";

export const CARD_FORGOTTEN_BOOKMARK = 1;
export const ELD_INTRO_BOOK_ACQUIRED = "eld-intro:book-acquired";

export type LibraryExitResult = {
  allowed: boolean;
  message?: string;
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

  shouldShowBookmarkLight(): boolean {
    return this.progress.has(ELD_INTRO_BOOK_ACQUIRED) && !this.cards.has(CARD_FORGOTTEN_BOOKMARK);
  }

  acquireBookmark(): SpecifiedCardDefinition | null {
    if (!this.shouldShowBookmarkLight()) return null;
    const result = this.acquisition.acquire(CARD_FORGOTTEN_BOOKMARK);
    return result.acquired ? result.definition : null;
  }

  inspectBookmarkLight(): boolean {
    return this.acquireBookmark() !== null;
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
