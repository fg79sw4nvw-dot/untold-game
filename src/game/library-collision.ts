import {
  ELD_LIBRARY_LAYOUT,
  ELD_LIBRARY_PIXEL_SIZE,
  ELD_LIBRARY_TILE_SIZE,
  type LibraryTilePoint,
  type LibraryTileRect,
} from "../data/eld-library";
import type { AxisAlignedRect } from "./axis-aligned-collision";

function tileRectToWorldRect(rect: LibraryTileRect): AxisAlignedRect {
  return {
    left: rect.x * ELD_LIBRARY_TILE_SIZE,
    top: rect.y * ELD_LIBRARY_TILE_SIZE,
    right: (rect.x + rect.widthTiles) * ELD_LIBRARY_TILE_SIZE,
    bottom: (rect.y + rect.heightTiles) * ELD_LIBRARY_TILE_SIZE,
  };
}

function centeredSquareAtTile(tile: LibraryTilePoint, size: number): AxisAlignedRect {
  const centerX = (tile[0] + 0.5) * ELD_LIBRARY_TILE_SIZE;
  const centerY = (tile[1] + 0.5) * ELD_LIBRARY_TILE_SIZE;
  const half = size / 2;
  return {
    left: centerX - half,
    top: centerY - half,
    right: centerX + half,
    bottom: centerY + half,
  };
}

const fixtureRects: readonly LibraryTileRect[] = [
  ELD_LIBRARY_LAYOUT.shelves.topWall,
  ELD_LIBRARY_LAYOUT.shelves.leftWall,
  ELD_LIBRARY_LAYOUT.shelves.rightWall,
  ELD_LIBRARY_LAYOUT.shelves.centralBack,
  ELD_LIBRARY_LAYOUT.shelves.centralFront,
  ELD_LIBRARY_LAYOUT.shelves.auxiliary,
  ELD_LIBRARY_LAYOUT.librarianCounter.rect,
  ELD_LIBRARY_LAYOUT.basementStairs.rect,
  ELD_LIBRARY_LAYOUT.readingDesk.rect,
];

// Preserve the existing rendered stool footprint (5% of the 640px room width)
// while moving collision authority out of DOM measurements.
const STOOL_COLLISION_SIZE_PX = ELD_LIBRARY_PIXEL_SIZE[0] * 0.05;

export const ELD_LIBRARY_COLLISION_OBSTACLES: readonly AxisAlignedRect[] = [
  ...fixtureRects.map(tileRectToWorldRect),
  ...ELD_LIBRARY_LAYOUT.readingDesk.stoolTiles.map(tile => (
    centeredSquareAtTile(tile, STOOL_COLLISION_SIZE_PX)
  )),
];
