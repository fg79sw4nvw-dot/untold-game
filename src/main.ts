import "./styles.css";
import "./first-book-reading.css";
import "./library-tutorial.css";
import {
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_TILE_SIZE,
  type LibraryTilePoint,
} from "./data/eld-library";
import {
  AFTER_FIRST_BOOK_THOUGHT_TO_LIBRARIAN_MOVE_MS,
  BOOK_DISCOVERY_THOUGHT,
  BOOK_DISCOVERY_TO_ACQUIRE_MS,
  FIRST_BOOK_CLOSED_PAUSE_MS,
  FIRST_BOOK_MESSAGE_INPUT_LOCK_MS,
  FIRST_BOOK_TITLE_PAUSE_MS,
  FIRST_BOOK_TITLE_THOUGHT,
  LIBRARIAN_AFTER_FAREWELL_TO_FREE_MS,
  LIBRARIAN_AFTER_SELF_ONLY_THOUGHT_PAUSE_MS,
  LIBRARIAN_BOOK_INSPECTION_PAUSE_MS,
  LIBRARIAN_BOOK_REPORT_DIALOGUE,
  LIBRARIAN_OBSERVES_PROTAGONIST_PAUSE_MS,
  LIBRARIAN_REPORT_BEFORE_INSPECTION_END,
  LIBRARIAN_REPORT_BEFORE_OBSERVATION_END,
  LIBRARIAN_REPORT_SELF_ONLY_THOUGHT_INDEX,
  LIBRARIAN_REPORT_START_PAUSE_MS,
  LIBRARY_BOOK_DISCOVERY_PAUSE_MS,
  LIBRARY_OPENING_DIALOGUE,
  LIBRARY_SORTING_PAUSE_MS,
  OPENING_MONOLOGUE,
  OPENING_MONOLOGUE_PROVISIONAL_LINE_MS,
  PROTAGONIST_AFTER_FIRST_BOOK_READING,
} from "./data/opening-sequence";
import { ProgressState } from "./domain/progress";
import { QuestTracker } from "./domain/quests";
import { SpecifiedCardCollection } from "./domain/specified-cards";
import { BookEatingRatFlow } from "./game/book-eating-rat";
import { EldIntroFlow } from "./game/eld-intro";
import { rankInteractionCandidates } from "./game/interaction-targeting";
import { LibraryTutorialController } from "./game/library-tutorial-controller";
import { LibraryTutorialPresentation } from "./game/library-tutorial-presentation";
import { OpeningSequenceController } from "./game/opening-sequence-controller";
import { CardizationView } from "./ui/cardization-view";
import { FirstBookMessageView } from "./ui/first-book-message-view";
import { LibraryFreeRoamInput } from "./ui/library-free-roam-input";
import { LibraryOpeningView } from "./ui/library-opening-view";
import { OpeningCinematicView } from "./ui/opening-cinematic-view";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="game-shell game-shell--opening">
    <section class="opening-library-stage" hidden aria-label="エルド図書館">
      <div class="opening-library-stage__room" aria-hidden="false">
        <div class="opening-library-stage__entrance"></div>
      </div>
    </section>
  </main>
`;

const shell = document.querySelector<HTMLElement>(".game-shell")!;
const libraryStage = document.querySelector<HTMLElement>(".opening-library-stage")!;
const libraryRoom = document.querySelector<HTMLElement>(".opening-library-stage__room")!;
const openingFlow = new OpeningSequenceController();
const progress = new ProgressState();
const specifiedCards = new SpecifiedCardCollection();
const quests = new QuestTracker();
const eldIntro = new EldIntroFlow(progress, specifiedCards);
const bookRat = new BookEatingRatFlow(progress, quests, specifiedCards);
const libraryTutorialFlow = new LibraryTutorialController(eldIntro, bookRat);
const cinematic = new OpeningCinematicView(shell);
const libraryOpening = new LibraryOpeningView(libraryStage, libraryRoom);
const firstBookMessage = new FirstBookMessageView(shell);
const cardization = new CardizationView(shell);
const libraryTutorial = new LibraryTutorialPresentation(
  libraryTutorialFlow,
  libraryOpening,
  cardization,
  wait,
);
const libraryFreeRoam = new LibraryFreeRoamInput(
  libraryStage,
  libraryOpening,
  handleLibraryTap,
);

void libraryFreeRoam;

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function tileCenter([x, y]: LibraryTilePoint): { x: number; y: number } {
  return {
    x: (x + 0.5) * ELD_LIBRARY_TILE_SIZE,
    y: (y + 0.5) * ELD_LIBRARY_TILE_SIZE,
  };
}

async function handleLibraryTap(): Promise<void> {
  if (!libraryTutorialFlow.shouldShowBookmarkLight()) return;

  const ranked = rankInteractionCandidates(
    libraryOpening.getProtagonistPosition(),
    libraryOpening.getFacingVector(),
    [{
      value: "bookmark-light" as const,
      position: tileCenter(ELD_LIBRARY_LAYOUT.bookmarkLight.tilePosition),
    }],
  );

  if (ranked[0]?.value !== "bookmark-light") return;
  await libraryTutorial.inspectBookmarkLight();
}

async function showDialogueRange(start: number, end: number): Promise<void> {
  for (let index = start; index < end; index += 1) {
    const line = LIBRARIAN_BOOK_REPORT_DIALOGUE[index];
    if (line !== undefined) await libraryOpening.showLine(line);
  }
}

async function playConfirmedLibrarianReport(): Promise<void> {
  await wait(AFTER_FIRST_BOOK_THOUGHT_TO_LIBRARIAN_MOVE_MS);
  await libraryOpening.moveTo(
    ELD_LIBRARY_LAYOUT.openingEvent.librarianReportTile,
    ELD_LIBRARY_LAYOUT.openingEvent.librarianReportFacing,
  );
  await wait(LIBRARIAN_REPORT_START_PAUSE_MS);

  if (!openingFlow.beginLibrarianReport()) return;
  libraryOpening.setOpeningPhase("librarian-report");

  await showDialogueRange(0, LIBRARIAN_REPORT_BEFORE_INSPECTION_END);

  // The transfer itself is confirmed, while a dedicated hand-over animation is not.
  libraryOpening.setBookHolder("librarian");
  await wait(LIBRARIAN_BOOK_INSPECTION_PAUSE_MS);

  await showDialogueRange(
    LIBRARIAN_REPORT_BEFORE_INSPECTION_END,
    LIBRARIAN_REPORT_BEFORE_OBSERVATION_END,
  );

  libraryOpening.setBookHolder("protagonist");
  await wait(LIBRARIAN_OBSERVES_PROTAGONIST_PAUSE_MS);

  await showDialogueRange(
    LIBRARIAN_REPORT_BEFORE_OBSERVATION_END,
    LIBRARIAN_REPORT_SELF_ONLY_THOUGHT_INDEX + 1,
  );
  await wait(LIBRARIAN_AFTER_SELF_ONLY_THOUGHT_PAUSE_MS);

  await showDialogueRange(
    LIBRARIAN_REPORT_SELF_ONLY_THOUGHT_INDEX + 1,
    LIBRARIAN_BOOK_REPORT_DIALOGUE.length,
  );
  await wait(LIBRARIAN_AFTER_FAREWELL_TO_FREE_MS);

  openingFlow.finishLibrarianReport();
  libraryOpening.setOpeningPhase("free-library");
  libraryTutorial.revealBookmarkLight();
}

async function playConfirmedFirstBookReading(): Promise<void> {
  if (!openingFlow.showFirstBookMessage()) return;

  firstBookMessage.showClosedBook();
  await wait(FIRST_BOOK_CLOSED_PAUSE_MS);

  // The cover-opening animation exists in the confirmed sequence, but its
  // concrete duration and motion are still unresolved. Keep the state boundary
  // explicit without inventing a duration here.
  firstBookMessage.showTitleSpread();
  await wait(FIRST_BOOK_TITLE_PAUSE_MS);

  await firstBookMessage.showThought(FIRST_BOOK_TITLE_THOUGHT);

  // The page-turn animation from the title spread to pages 2-3 is likewise a
  // confirmed beat with unresolved duration. The view switches only after the
  // title thought has ended; animation timing can be inserted at this boundary.
  firstBookMessage.showGameMasterSpread();
  await firstBookMessage.waitForDismissAfterLock(FIRST_BOOK_MESSAGE_INPUT_LOCK_MS);
  firstBookMessage.hide();

  openingFlow.finishFirstBookMessage();
  await libraryOpening.showLine({ speaker: null, text: PROTAGONIST_AFTER_FIRST_BOOK_READING });
  await playConfirmedLibrarianReport();
}

async function playConfirmedLibraryOpening(): Promise<void> {
  const [sorting1, sorting2, sorting3, sorting4] = ELD_LIBRARY_LAYOUT.openingEvent.sortingAnchors;
  const discovery = ELD_LIBRARY_LAYOUT.openingEvent.bookDiscoveryTile;
  const routeColumn = ELD_LIBRARY_LAYOUT.openingEvent.routeAroundCentralShelfColumn;

  libraryOpening.setFacing("up");
  await wait(LIBRARY_SORTING_PAUSE_MS);

  await libraryOpening.moveTo(sorting2, "up");
  await wait(LIBRARY_SORTING_PAUSE_MS);

  await libraryOpening.moveTo(sorting3, "up");
  await wait(LIBRARY_SORTING_PAUSE_MS);

  for (const line of LIBRARY_OPENING_DIALOGUE) {
    await libraryOpening.showLine(line);
  }

  const sorting4Approach: readonly LibraryTilePoint[] = [
    [routeColumn, sorting4[1]],
    sorting4,
  ];
  await libraryOpening.moveAlong(sorting4Approach, "up");
  await wait(LIBRARY_SORTING_PAUSE_MS);

  const discoveryRoute: readonly LibraryTilePoint[] = [
    [routeColumn, sorting4[1]],
    [routeColumn, discovery[1]],
    discovery,
  ];
  await libraryOpening.moveAlong(discoveryRoute, "up");
  await wait(LIBRARY_BOOK_DISCOVERY_PAUSE_MS);

  await libraryOpening.showLine({ speaker: null, text: BOOK_DISCOVERY_THOUGHT });
  await wait(BOOK_DISCOVERY_TO_ACQUIRE_MS);
  libraryOpening.takeBook();
  eldIntro.markBookAcquired();

  await playConfirmedFirstBookReading();

  void sorting1;
}

async function enterLibrary(): Promise<void> {
  if (!openingFlow.enterLibraryIntro()) return;

  cinematic.hide();
  shell.classList.add("game-shell--blackout");
  await nextFrame();

  libraryStage.hidden = false;
  shell.classList.remove("game-shell--blackout");

  await playConfirmedLibraryOpening();
}

async function playOpeningCinematic(): Promise<void> {
  for (let index = 0; index < OPENING_MONOLOGUE.length; index += 1) {
    cinematic.showLine(index);
    await wait(OPENING_MONOLOGUE_PROVISIONAL_LINE_MS);
  }

  await enterLibrary();
}

void playOpeningCinematic();
