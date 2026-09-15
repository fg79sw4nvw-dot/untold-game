export type LibraryInteractionPhase =
  | "opening"
  | "librarian-report"
  | "free-library"
  | "bookmark-inspection"
  | "bookmark-cardization"
  | "free-library-after-bookmark"
  | "book-rat-intro"
  | "book-rat-intro-complete"
  | "first-recording-thoughts"
  | "first-recording-awaiting-selection-ui"
  | "first-recording-awaiting-selection"
  | "first-recording-saved"
  | "first-recording-review"
  | "free-library-after-first-recording";

export class LibraryInteractionState {
  private phase: LibraryInteractionPhase = "opening";

  currentPhase(): LibraryInteractionPhase {
    return this.phase;
  }

  setPhase(phase: LibraryInteractionPhase): void {
    this.phase = phase;
  }

  allowsFreeRoam(): boolean {
    return this.phase === "free-library"
      || this.phase === "free-library-after-bookmark"
      || this.phase === "free-library-after-first-recording";
  }
}
