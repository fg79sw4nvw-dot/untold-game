import {
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_TILE_SIZE,
  type LibraryTilePoint,
} from "../data/eld-library";
import type { WorldPoint } from "./axis-aligned-collision";
import type { DirectionVector } from "./floating-field-input";

export type LibraryFacing = "up" | "right" | "down" | "left";

export function libraryTileCenter([x, y]: LibraryTilePoint): WorldPoint {
  return {
    x: (x + 0.5) * ELD_LIBRARY_TILE_SIZE,
    y: (y + 0.5) * ELD_LIBRARY_TILE_SIZE,
  };
}

function facingVector(facing: LibraryFacing): DirectionVector {
  if (facing === "up") return { x: 0, y: -1 };
  if (facing === "right") return { x: 1, y: 0 };
  if (facing === "down") return { x: 0, y: 1 };
  return { x: -1, y: 0 };
}

export class LibraryPlayerState {
  private position: WorldPoint;
  private facing: LibraryFacing = "up";

  constructor(
    initialTile: LibraryTilePoint = ELD_LIBRARY_LAYOUT.openingEvent.sortingAnchors[0],
  ) {
    this.position = libraryTileCenter(initialTile);
  }

  getPosition(): WorldPoint {
    return this.position;
  }

  setPosition(position: WorldPoint): void {
    this.position = position;
  }

  getFacing(): LibraryFacing {
    return this.facing;
  }

  setFacing(facing: LibraryFacing): void {
    this.facing = facing;
  }

  getFacingVector(): DirectionVector {
    return facingVector(this.facing);
  }

  faceMovementDirection(direction: DirectionVector): void {
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      this.facing = direction.x >= 0 ? "right" : "left";
      return;
    }
    this.facing = direction.y >= 0 ? "down" : "up";
  }

  faceToward(tile: LibraryTilePoint): void {
    const target = libraryTileCenter(tile);
    this.faceMovementDirection({
      x: target.x - this.position.x,
      y: target.y - this.position.y,
    });
  }
}
