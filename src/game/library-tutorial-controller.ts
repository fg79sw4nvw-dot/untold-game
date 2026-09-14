import type { DialogueSentence } from "../domain/conversation";
import { LIBRARIAN_AFTER_BOOKMARK } from "../data/eld-content";
import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";
import { BookEatingRatFlow } from "./book-eating-rat";
import { EldIntroFlow, type LibraryExitResult } from "./eld-intro";

export type BookmarkTutorialPhase =
  | "waiting"
  | "inspection-thought"
  | "cardization"
  | "post-cardization"
  | "complete";

export class LibraryTutorialController {
  private bookmarkPhase: BookmarkTutorialPhase = "waiting";
  private bookRatIntroActive = false;

  constructor(
    private readonly intro: EldIntroFlow,
    private readonly bookRat: BookEatingRatFlow,
  ) {}

  currentBookmarkPhase(): BookmarkTutorialPhase {
    return this.bookmarkPhase;
  }

  shouldShowBookmarkLight(): boolean {
    return this.intro.shouldShowBookmarkLight();
  }

  beginBookmarkInspection(): boolean {
    if (this.bookmarkPhase !== "waiting" || !this.intro.shouldShowBookmarkLight()) return false;
    this.bookmarkPhase = "inspection-thought";
    return true;
  }

  beginBookmarkCardization(): SpecifiedCardDefinition | null {
    if (this.bookmarkPhase !== "inspection-thought") return null;
    const definition = this.intro.acquireBookmark();
    if (!definition) return null;
    this.bookmarkPhase = "cardization";
    return definition;
  }

  markBookmarkCardizationComplete(): boolean {
    if (this.bookmarkPhase !== "cardization") return false;
    this.bookmarkPhase = "post-cardization";
    return true;
  }

  finishBookmarkTutorial(): boolean {
    if (this.bookmarkPhase !== "post-cardization") return false;
    this.bookmarkPhase = "complete";
    return true;
  }

  attemptLibraryExit(): LibraryExitResult {
    return this.intro.attemptLibraryExit();
  }

  beginBookRatIntro(): readonly DialogueSentence[] | null {
    if (this.bookRatIntroActive || !this.bookRat.canTriggerIntro()) return null;
    this.bookRatIntroActive = true;
    return LIBRARIAN_AFTER_BOOKMARK;
  }

  finishBookRatIntro(): boolean {
    if (!this.bookRatIntroActive) return false;
    this.bookRatIntroActive = false;
    return this.bookRat.markIntroSeen();
  }
}
