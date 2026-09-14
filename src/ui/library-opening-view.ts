import {
  ELD_LIBRARY_GRID_SIZE,
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_PIXEL_SIZE,
  ELD_LIBRARY_TILE_SIZE,
  type LibraryTilePoint,
  type LibraryTileRect,
} from "../data/eld-library";
import type { DirectionVector } from "../game/floating-field-input";
import type { AxisAlignedRect, WorldPoint } from "../game/axis-aligned-collision";

const NORMAL_MOVEMENT_SPEED_PX_PER_SECOND = 110;

type Facing = "up" | "right" | "down" | "left";
type BookHolder = "protagonist" | "librarian";

type DialogueLine = Readonly<{
  speaker: string | null;
  text: string;
}>;

function tileCenter([x, y]: LibraryTilePoint): WorldPoint {
  return {
    x: (x + 0.5) * ELD_LIBRARY_TILE_SIZE,
    y: (y + 0.5) * ELD_LIBRARY_TILE_SIZE,
  };
}

function placeTileRect(element: HTMLElement, rect: LibraryTileRect): void {
  const [gridWidth, gridHeight] = ELD_LIBRARY_GRID_SIZE;
  element.style.left = `${(rect.x / gridWidth) * 100}%`;
  element.style.top = `${(rect.y / gridHeight) * 100}%`;
  element.style.width = `${(rect.widthTiles / gridWidth) * 100}%`;
  element.style.height = `${(rect.heightTiles / gridHeight) * 100}%`;
}

function placeAtTile(element: HTMLElement, tile: LibraryTilePoint): void {
  placeAtWorldPoint(element, tileCenter(tile));
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

function facingVector(facing: Facing): DirectionVector {
  if (facing === "up") return { x: 0, y: -1 };
  if (facing === "right") return { x: 1, y: 0 };
  if (facing === "down") return { x: 0, y: 1 };
  return { x: -1, y: 0 };
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
  private protagonistTile: LibraryTilePoint = ELD_LIBRARY_LAYOUT.openingEvent.sortingAnchors[0];
  private protagonistPosition: WorldPoint = tileCenter(this.protagonistTile);
  private protagonistFacing: Facing = "up";

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

    this.bookmarkLight = document.createElement("div");
    this.bookmarkLight.className = "opening-library-stage__bookmark-light";
    this.bookmarkLight.hidden = true;
    this.bookmarkLight.setAttribute("aria-label", "閲覧机の小さな光");
    placeAtTile(this.bookmarkLight, ELD_LIBRARY_LAYOUT.bookmarkLight.tilePosition);
    this.room.append(this.bookmarkLight);

    this.protagonist = document.createElement("div");
    this.protagonist.className = "opening-library-stage__character opening-library-stage__character--protagonist";
    this.protagonist.setAttribute("aria-label", "主人公");
    this.setFacing("up");
    placeAtWorldPoint(this.protagonist, this.protagonistPosition);
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
    this.protagonistFacing = facing;
    this.protagonist?.setAttribute("data-facing", facing);
  }

  getFacingVector(): DirectionVector {
    return facingVector(this.protagonistFacing);
  }

  getProtagonistPosition(): WorldPoint {
    return this.protagonistPosition;
  }

  setProtagonistPosition(position: WorldPoint): void {
    this.protagonist.style.transitionDuration = "0ms";
    this.protagonistPosition = position;
    placeAtWorldPoint(this.protagonist, position);
  }

  getCollisionObstacles(): AxisAlignedRect[] {
    const roomRect = this.room.getBoundingClientRect();
    if (roomRect.width <= 0 || roomRect.height <= 0) return [];
    const scaleX = ELD_LIBRARY_PIXEL_SIZE[0] / roomRect.width;
    const scaleY = ELD_LIBRARY_PIXEL_SIZE[1] / roomRect.height;

    return Array.from(this.room.querySelectorAll<HTMLElement>(
      ".opening-library-stage__fixture, .opening-library-stage__stool",
    )).map(element => {
      const rect = element.getBoundingClientRect();
      return {
        left: (rect.left - roomRect.left) * scaleX,
        top: (rect.top - roomRect.top) * scaleY,
        right: (rect.right - roomRect.left) * scaleX,
        bottom: (rect.bottom - roomRect.top) * scaleY,
      };
    });
  }

  faceMovementDirection(direction: DirectionVector): void {
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      this.setFacing(direction.x >= 0 ? "right" : "left");
      return;
    }
    this.setFacing(direction.y >= 0 ? "down" : "up");
  }

  faceToward([targetX, targetY]: LibraryTilePoint): void {
    const target = tileCenter([targetX, targetY]);
    const dx = target.x - this.protagonistPosition.x;
    const dy = target.y - this.protagonistPosition.y;
    this.faceMovementDirection({ x: dx, y: dy });
  }

  setBookHolder(holder: BookHolder): void {
    this.stage.dataset.bookHolder = holder;
  }

  setOpeningPhase(phase: string): void {
    this.stage.dataset.openingPhase = phase;
  }

  getOpeningPhase(): string {
    return this.stage.dataset.openingPhase ?? "";
  }

  showBookmarkLight(): void {
    this.bookmarkLight.hidden = false;
  }

  hideBookmarkLight(): void {
    this.bookmarkLight.hidden = true;
  }

  async moveTo(tile: LibraryTilePoint, facing?: Facing): Promise<void> {
    const target = tileCenter(tile);
    const durationMs = movementDurationMs(this.protagonistPosition, target);
    this.protagonist.style.transitionDuration = `${durationMs}ms`;
    placeAtWorldPoint(this.protagonist, target);
    this.protagonistPosition = target;
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
    this.setBookHolder("protagonist");
  }
}
