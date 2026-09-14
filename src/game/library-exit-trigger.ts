import { ELD_LIBRARY_LAYOUT, ELD_LIBRARY_PIXEL_SIZE, ELD_LIBRARY_TILE_SIZE } from "../data/eld-library";
import { PROTAGONIST_COLLISION_HEIGHT_PX, type WorldPoint } from "./axis-aligned-collision";
import type { DirectionVector } from "./floating-field-input";

const EXIT_MIN_X = ELD_LIBRARY_LAYOUT.entrance.xTiles[0] * ELD_LIBRARY_TILE_SIZE;
const EXIT_MAX_X = (ELD_LIBRARY_LAYOUT.entrance.xTiles[1] + 1) * ELD_LIBRARY_TILE_SIZE;
const SOUTH_EDGE_Y = ELD_LIBRARY_PIXEL_SIZE[1];
const HALF_COLLISION_HEIGHT = PROTAGONIST_COLLISION_HEIGHT_PX / 2;

export function attemptsLibraryExit(
  position: WorldPoint,
  delta: DirectionVector,
): boolean {
  if (delta.y <= 0) return false;

  const proposedX = position.x + delta.x;
  if (proposedX < EXIT_MIN_X || proposedX > EXIT_MAX_X) return false;

  const proposedY = position.y + delta.y;
  return proposedY + HALF_COLLISION_HEIGHT >= SOUTH_EDGE_Y;
}
