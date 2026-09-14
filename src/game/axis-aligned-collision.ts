import type { DirectionVector } from "./floating-field-input";

export type WorldPoint = Readonly<{ x: number; y: number }>;
export type AxisAlignedRect = Readonly<{
  left: number;
  top: number;
  right: number;
  bottom: number;
}>;

export const PROTAGONIST_COLLISION_WIDTH_PX = 24;
export const PROTAGONIST_COLLISION_HEIGHT_PX = 16;

export function protagonistCollisionRect(position: WorldPoint): AxisAlignedRect {
  const halfWidth = PROTAGONIST_COLLISION_WIDTH_PX / 2;
  const halfHeight = PROTAGONIST_COLLISION_HEIGHT_PX / 2;
  return {
    left: position.x - halfWidth,
    top: position.y - halfHeight,
    right: position.x + halfWidth,
    bottom: position.y + halfHeight,
  };
}

export function rectanglesOverlap(a: AxisAlignedRect, b: AxisAlignedRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function insideBounds(rect: AxisAlignedRect, bounds: AxisAlignedRect): boolean {
  return rect.left >= bounds.left
    && rect.right <= bounds.right
    && rect.top >= bounds.top
    && rect.bottom <= bounds.bottom;
}

function canOccupy(position: WorldPoint, obstacles: readonly AxisAlignedRect[], bounds: AxisAlignedRect): boolean {
  const playerRect = protagonistCollisionRect(position);
  return insideBounds(playerRect, bounds) && !obstacles.some(obstacle => rectanglesOverlap(playerRect, obstacle));
}

export function moveWithAxisSliding(
  position: WorldPoint,
  delta: DirectionVector,
  obstacles: readonly AxisAlignedRect[],
  bounds: AxisAlignedRect,
): WorldPoint {
  let next = position;

  const xOnly = { x: position.x + delta.x, y: position.y };
  if (canOccupy(xOnly, obstacles, bounds)) next = xOnly;

  const yOnly = { x: next.x, y: position.y + delta.y };
  if (canOccupy(yOnly, obstacles, bounds)) next = yOnly;

  return next;
}
