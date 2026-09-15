import {
  ELD_LIBRARY_GRID_SIZE,
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_PIXEL_SIZE,
  type LibraryTilePoint,
  type LibraryTileRect,
} from "../data/eld-library";
import type { WorldPoint } from "../game/axis-aligned-collision";
import type { DirectionVector } from "../game/floating-field-input";
import {
  LibraryPlayerState,
  libraryTileCenter,
  type LibraryFacing,
} from "../game/library-player-state";

const NORMAL_MOVEMENT_SPEED_PX_PER_SECOND = 110;

type BookHolder = "protagonist" | "librarian";

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

function placeAtTile(element: HTMLElement, tile: LibraryTilePoint): void {
  placeAtWorldPoint(element, libraryTileCenter(tile));
}

function placeAtWorldPoint(element: HTMLElement, position: WorldPoint): void {
  const [pixelWidth, pixelHeight] = ELD_LIBRARY_PIXEL_SIZE;
  element.style.left = `${(position.x / pixelWidth) * 100}%`;
  element.style.top = `${(position.y / pixelHeight) * 100}%`;
}

function movementDurationMs(from: WorldPoint, to: WorldPoint): number {
  const distancePixels = Math.hypot(to.x - from.x, to.y - from.y);
  return (distancePixels / NORMAL_MOVEMENT_SPEED_PX_PER_SECOND) * 1000;
}

export class LibraryOpeningView {
  private readonly stage: HTMLElement;
  private readonly room: HTMLElement;
  private readonly protagonist: HTMLDivElement;
  private readonly bookMarker: HTMLDivElement;
  private readonly bookmarkLight: HTMLDivElement;
  private readonly dialogue: HTMLDivElement;
  private readonly dialogueSpeaker: HTMLDivElement;
  private readonly dialogueText: HTMLDivElement;

  constructor(
    stage: HTMLElement,
    room: HTMLElement,
    private readonly playerState: LibraryPlayerState,
  ) {
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

    this.bookmarkLight = document.createElement("div");
    this.bookmarkLight.className = "opening-library-stage__bookmark-light";
    this.bookmarkLight.hidden = true;
    this.bookmarkLight.setAttribute("aria-label", "閲覧机の小さな光");
    placeAtTile(this.bookmarkLight, ELD_LIBRARY_LAYOUT.bookmarkLight.tilePosition);
    this.room.append(this.bookmarkLight);

    this.protagonist = document.createElement("div");
    this.protagonist.className = "opening-library-stage__character opening-library-stage__character--protagonist";
    this.protagonist.setAttribute("aria-label", "主人公");
    this.setFacing(this.playerState.getFacing());
    placeAtWorldPoint(this.protagonist, this.playerState.getPosition());
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

  private renderFacing(): void {
    this.protagonist.setAttribute("data-facing", this.playerState.getFacing());
  }

  setFacing(facing: LibraryFacing): void {
    this.playerState.setFacing(facing);
    this.renderFacing();
  }

  setProtagonistPosition(position: WorldPoint): void {
    this.protagonist.style.transitionDuration = "0ms";
    this.playerState.setPosition(position);
    placeAtWorldPoint(this.protagonist, position);
  }

  faceMovementDirection(direction: DirectionVector): void {
    this.playerState.faceMovementDirection(direction);
    this.renderFacing();
  }

  faceToward(tile: LibraryTilePoint): void {
    this.playerState.faceToward(tile);
    this.renderFacing();
  }

  setBookHolder(holder: BookHolder): void {
    this.stage.dataset.bookHolder = holder;
  }

  showBookmarkLight(): void {
    this.bookmarkLight.hidden = false;
  }

  hideBookmarkLight(): void {
    this.bookmarkLight.hidden = true;
  }

  async moveTo(tile: LibraryTilePoint, facing?: LibraryFacing): Promise<void> {
    const from = this.playerState.getPosition();
    const target = libraryTileCenter(tile);
    const durationMs = movementDurationMs(from, target);
    this.protagonist.style.transitionDuration = `${durationMs}ms`;
    placeAtWorldPoint(this.protagonist, target);
    this.playerState.setPosition(target);

    if (durationMs > 0) {
      await new Promise<void>(resolve => window.setTimeout(resolve, durationMs));
    }

    if (facing !== undefined) this.setFacing(facing);
  }

  async moveAlong(tiles: readonly LibraryTilePoint[], finalFacing?: LibraryFacing): Promise<void> {
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
    this.setBookHolder("protagonist");
  }
}
