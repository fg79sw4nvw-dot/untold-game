import { WORLD, type Point } from "../data/world";
import type { WorldPassability } from "./passability";

export type WorldMoveDirection = Readonly<{ x: number; y: number }>;

function normalize(direction: WorldMoveDirection): WorldMoveDirection {
  const length = Math.hypot(direction.x, direction.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: direction.x / length, y: direction.y / length };
}

export class WorldPlayerState {
  private position: Point | null = null;

  getPosition(): Point | null {
    return this.position;
  }

  setOrigin(position: Point): void {
    this.position = [position[0], position[1]];
  }

  move(direction: WorldMoveDirection, elapsedSeconds: number, passability: WorldPassability): Point | null {
    if (!this.position) return null;

    const normalized = normalize(direction);
    if (normalized.x === 0 && normalized.y === 0) return this.position;

    const next: Point = [
      this.position[0] + normalized.x * WORLD.playerSpeedPxPerSecond * elapsedSeconds,
      this.position[1] + normalized.y * WORLD.playerSpeedPxPerSecond * elapsedSeconds,
    ];
    const half = WORLD.collisionWidthPx / 2;
    const footY = next[1];

    if (
      passability.isWalkable(next[0] - half, footY)
      && passability.isWalkable(next[0] + half, footY)
    ) {
      this.position = next;
    }

    return this.position;
  }
}
