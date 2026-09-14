import "./styles.css";
import { OPENING_MONOLOGUE } from "./data/opening-sequence";
import { OpeningSequenceController } from "./game/opening-sequence-controller";
import { OpeningCinematicView } from "./ui/opening-cinematic-view";
import { FirstBookMessageView } from "./ui/first-book-message-view";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="game-shell game-shell--opening">
    <section class="opening-library-stage" hidden aria-label="エルド図書館">
      <div class="opening-library-stage__room" aria-hidden="true">
        <div class="opening-library-stage__entrance"></div>
      </div>
    </section>
  </main>
`;

const shell = document.querySelector<HTMLElement>(".game-shell")!;
const libraryStage = document.querySelector<HTMLElement>(".opening-library-stage")!;
const openingFlow = new OpeningSequenceController();
const cinematic = new OpeningCinematicView(shell);
const firstBookMessage = new FirstBookMessageView(shell);

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

async function enterLibrary(): Promise<void> {
  if (!openingFlow.enterLibraryIntro()) return;

  cinematic.hide();
  shell.classList.add("game-shell--blackout");
  await nextFrame();

  libraryStage.hidden = false;
  shell.classList.remove("game-shell--blackout");

  // The confirmed sequence continues with forced shelf-to-shelf movement,
  // the librarian's gratitude, and the protagonist's short reply.
  // Their exact route and the exact wording of those first two spoken lines
  // are not fixed in the Wiki, so the runtime intentionally stops advancing
  // here instead of inventing them.
  void firstBookMessage;
}

async function playOpeningCinematic(): Promise<void> {
  for (let index = 0; index < OPENING_MONOLOGUE.length; index += 1) {
    cinematic.showLine(index);
    await new Promise(resolve => window.setTimeout(resolve, 4000));
  }

  await enterLibrary();
}

void playOpeningCinematic();
