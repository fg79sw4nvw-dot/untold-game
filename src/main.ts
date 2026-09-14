import "./styles.css";
import "./first-book-reading.css";
import { ELD_LIBRARY_LAYOUT, type LibraryTilePoint } from "./data/eld-library";
import {
  BOOK_DISCOVERY_THOUGHT,
  BOOK_DISCOVERY_TO_ACQUIRE_MS,
  FIRST_BOOK_CLOSED_PAUSE_MS,
  FIRST_BOOK_MESSAGE_INPUT_LOCK_MS,
  FIRST_BOOK_TITLE_PAUSE_MS,
  FIRST_BOOK_TITLE_THOUGHT,
  LIBRARY_BOOK_DISCOVERY_PAUSE_MS,
  LIBRARY_OPENING_DIALOGUE,
  LIBRARY_SORTING_PAUSE_MS,
  OPENING_MONOLOGUE,
  OPENING_MONOLOGUE_PROVISIONAL_LINE_MS,
  PROTAGONIST_AFTER_FIRST_BOOK_READING,
} from "./data/opening-sequence";
import { OpeningSequenceController } from "./game/opening-sequence-controller";
import { FirstBookMessageView } from "./ui/first-book-message-view";
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
const cinematic = new OpeningCinematicView(shell);
const libraryOpening = new LibraryOpeningView(libraryStage, libraryRoom);
const firstBookMessage = new FirstBookMessageView(shell);

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms));
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
