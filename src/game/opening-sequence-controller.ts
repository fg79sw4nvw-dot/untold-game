export type OpeningSequencePhase =
  | "cinematic"
  | "library-intro"
  | "first-book-message"
  | "after-first-book-reading"
  | "librarian-report"
  | "free-library";

/**
 * State holder for the confirmed opening sequence.
 *
 * This intentionally does not invent timings, movement routes, dialogue wording,
 * or staging that the Wiki has not fixed. UI layers advance this state only
 * when the corresponding confirmed beat has actually been presented.
 */
export class OpeningSequenceController {
  private phase: OpeningSequencePhase = "cinematic";

  currentPhase(): OpeningSequencePhase {
    return this.phase;
  }

  enterLibraryIntro(): boolean {
    if (this.phase !== "cinematic") return false;
    this.phase = "library-intro";
    return true;
  }

  showFirstBookMessage(): boolean {
    if (this.phase !== "library-intro") return false;
    this.phase = "first-book-message";
    return true;
  }

  finishFirstBookMessage(): boolean {
    if (this.phase !== "first-book-message") return false;
    this.phase = "after-first-book-reading";
    return true;
  }

  beginLibrarianReport(): boolean {
    if (this.phase !== "after-first-book-reading") return false;
    this.phase = "librarian-report";
    return true;
  }

  finishLibrarianReport(): boolean {
    if (this.phase !== "librarian-report") return false;
    this.phase = "free-library";
    return true;
  }
}
