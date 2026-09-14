import "./styles.css";
import { ELD_LIBRARY_LAYOUT, type LibraryTilePoint } from "./data/eld-library";
import {
  BOOK_DISCOVERY_THOUGHT,
  BOOK_DISCOVERY_TO_ACQUIRE_MS,
  LIBRARY_BOOK_DISCOVERY_PAUSE_MS,
  LIBRARY_OPENING_DIALOGUE,
  LIBRARY_SORTING_PAUSE_MS,
  OPENING_MONOLOGUE,
  OPENING_MONOLOGUE_PROVISIONAL_LINE_MS,
} from "./data/opening-sequence";
import { OpeningSequenceController } from "./game/opening-sequence-controller";
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

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms));
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

  // BOOK acquisition is now reached using only confirmed opening-event data.
  // The subsequent first-reading presentation is implemented separately because
  // its title-page/opening animation still has unresolved visual parameters.
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
