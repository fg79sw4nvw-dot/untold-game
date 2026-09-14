import {
  ELD_LIBRARY_GRID_SIZE,
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_TILE_SIZE,
  type LibraryTilePoint,
  type LibraryTileRect,
} from "../data/eld-library";

const NORMAL_MOVEMENT_SPEED_PX_PER_SECOND = 110;

type Facing = "up" | "right" | "down" | "left";

type DialogueLine = Readonly<{
  speaker: string | null;
  text: string;
}>;

function placeTileRect(element: HTMLElement, rect: LibraryTileRect): void {
  const [gridWidth, gridHeight] = ELD_LIBRARY_GRID_SIZE;
  element.style.left = `${(rect.x / gridWidth) * 100}%`;
  element.style.top = `${(rect.y / gridHeight) * 100}%`;
  element.style.width = `${(rect.widthTiles / gridWidth) * 100}%`;
  element.style.height = `${(rect.heightTiles / gridHeight) * 100}%`;
}

function placeAtTile(element: HTMLElement, [x, y]: LibraryTilePoint): void {
  const [gridWidth, gridHeight] = ELD_LIBRARY_GRID_SIZE;
  element.style.left = `${((x + 0.5) / gridWidth) * 100}%`;
  element.style.top = `${((y + 0.5) / gridHeight) * 100}%`;
}

function movementDurationMs(from: LibraryTilePoint, to: LibraryTilePoint): number {
  const distanceTiles = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const distancePixels = distanceTiles * ELD_LIBRARY_TILE_SIZE;
  return (distancePixels / NORMAL_MOVEMENT_SPEED_PX_PER_SECOND) * 1000;
}

export class LibraryOpeningView {
  private readonly stage: HTMLElement;
  private readonly room: HTMLElement;
  private readonly protagonist: HTMLDivElement;
  private readonly bookMarker: HTMLDivElement;
  private readonly dialogue: HTMLDivElement;
  private readonly dialogueSpeaker: HTMLDivElement;
  private readonly dialogueText: HTMLDivElement;
  private protagonistTile: LibraryTilePoint = ELD_LIBRARY_LAYOUT.openingEvent.sortingAnchors[0];

  constructor(stage: HTMLElement, room: HTMLElement) {
    this.stage = stage;
    this.room = room;

    this.renderFurniture();

    const librarian = document.createElement("div");
    librarian.className = "opening-library-stage__character opening-library-stage__character--librarian";
    librarian.dataset.facing = ELD_LIBRARY_LAYOUT.librarianCounter.librarianFacing;
    librarian.setAttribute("aria-label", "司書");
    placeAtTile(librarian, ELD_LIBRARY_LAYOUT.librarianCounter.librarianTile);
    this.room.append(librarian);

    this.bookMarker = document.createElement("div");
    this.bookMarker.className = "opening-library-stage__book";
    this.bookMarker.textContent = "BOOK";
    this.bookMarker.setAttribute("aria-label", "BOOK");
    placeAtTile(this.bookMarker, ELD_LIBRARY_LAYOUT.openingEvent.bookTile);
    this.room.append(this.bookMarker);

    this.protagonist = document.createElement("div");
    this.protagonist.className = "opening-library-stage__character opening-library-stage__character--protagonist";
    this.protagonist.setAttribute("aria-label", "主人公");
    this.setFacing("up");
    placeAtTile(this.protagonist, this.protagonistTile);
    this.room.append(this.protagonist);

    this.dialogue = document.createElement("div");
    this.dialogue.className = "opening-dialogue";
    this.dialogue.hidden = true;

    this.dialogueSpeaker = document.createElement("div");
    this.dialogueSpeaker.className = "opening-dialogue__speaker";

    this.dialogueText = document.createElement("div");
    this.dialogueText.className = "opening-dialogue__text";

    this.dialogue.append(this.dialogueSpeaker, this.dialogueText);
    this.stage.append(this.dialogue);
  }

  private renderFurniture(): void {
    const furniture: Array<readonly [string, LibraryTileRect]> = [
      ["shelf", ELD_LIBRARY_LAYOUT.shelves.topWall],
      ["shelf", ELD_LIBRARY_LAYOUT.shelves.leftWall],
      ["shelf", ELD_LIBRARY_LAYOUT.shelves.rightWall],
      ["shelf", ELD_LIBRARY_LAYOUT.shelves.centralBack],
      ["shelf", ELD_LIBRARY_LAYOUT.shelves.centralFront],
      ["shelf", ELD_LIBRARY_LAYOUT.shelves.auxiliary],
      ["counter", ELD_LIBRARY_LAYOUT.librarianCounter.rect],
      ["stairs", ELD_LIBRARY_LAYOUT.basementStairs.rect],
      ["desk", ELD_LIBRARY_LAYOUT.readingDesk.rect],
    ];

    for (const [kind, rect] of furniture) {
      const element = document.createElement("div");
      element.className = `opening-library-stage__fixture opening-library-stage__fixture--${kind}`;
      placeTileRect(element, rect);
      this.room.append(element);
    }

    for (const stoolTile of ELD_LIBRARY_LAYOUT.readingDesk.stoolTiles) {
      const stool = document.createElement("div");
      stool.className = "opening-library-stage__stool";
      placeAtTile(stool, stoolTile);
      this.room.append(stool);
    }
  }

  setFacing(facing: Facing): void {
    this.protagonist?.setAttribute("data-facing", facing);
  }

  async moveTo(tile: LibraryTilePoint, facing?: Facing): Promise<void> {
    const durationMs = movementDurationMs(this.protagonistTile, tile);
    this.protagonist.style.transitionDuration = `${durationMs}ms`;
    placeAtTile(this.protagonist, tile);
    this.protagonistTile = tile;

    if (durationMs > 0) {
      await new Promise<void>(resolve => window.setTimeout(resolve, durationMs));
    }

    if (facing !== undefined) this.setFacing(facing);
  }

  async moveAlong(tiles: readonly LibraryTilePoint[], finalFacing?: Facing): Promise<void> {
    for (const tile of tiles) await this.moveTo(tile);
    if (finalFacing !== undefined) this.setFacing(finalFacing);
  }

  async showLine(line: DialogueLine): Promise<void> {
    this.dialogueSpeaker.textContent = line.speaker ?? "";
    this.dialogueSpeaker.hidden = line.speaker === null;
    this.dialogueText.textContent = line.text;
    this.dialogue.hidden = false;

    await new Promise<void>(resolve => {
      const advance = (): void => {
        this.stage.removeEventListener("pointerup", advance);
        resolve();
      };
      this.stage.addEventListener("pointerup", advance, { once: true });
    });

    this.dialogue.hidden = true;
  }

  takeBook(): void {
    this.bookMarker.hidden = true;
  }
}
