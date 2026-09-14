import { describe, expect, it } from "vitest";
import {
  PROTAGONIST_COLLISION_HEIGHT_PX,
  PROTAGONIST_COLLISION_WIDTH_PX,
  moveWithAxisSliding,
  protagonistCollisionRect,
} from "./axis-aligned-collision";

const bounds = { left: 0, top: 0, right: 640, bottom: 1024 } as const;

describe("axis-aligned protagonist collision", () => {
  it("uses the confirmed 24x16 foot-centered box", () => {
    expect(PROTAGONIST_COLLISION_WIDTH_PX).toBe(24);
    expect(PROTAGONIST_COLLISION_HEIGHT_PX).toBe(16);
    expect(protagonistCollisionRect({ x: 100, y: 200 })).toEqual({
      left: 88,
      top: 192,
      right: 112,
      bottom: 208,
    });
  });

  it("blocks the colliding axis while preserving the other axis", () => {
    const obstacle = { left: 120, top: 0, right: 180, bottom: 300 } as const;
    const moved = moveWithAxisSliding(
      { x: 100, y: 200 },
      { x: 16, y: 12 },
      [obstacle],
      bounds,
    );

    expect(moved).toEqual({ x: 100, y: 212 });
  });

  it("keeps the foot box inside map bounds", () => {
    const moved = moveWithAxisSliding(
      { x: 12, y: 8 },
      { x: -5, y: -5 },
      [],
      bounds,
    );

    expect(moved).toEqual({ x: 12, y: 8 });
  });
});
