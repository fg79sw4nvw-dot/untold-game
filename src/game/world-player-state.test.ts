import { describe, expect, it } from "vitest";
import { WorldPlayerState } from "./world-player-state";

describe("WorldPlayerState", () => {
  it("moves using game coordinates without depending on a renderer", () => {
    const state = new WorldPlayerState();
    state.setOrigin([100, 100]);
    const passability = { isWalkable: () => true };

    expect(state.move({ x: 1, y: 0 }, 1, passability)).toEqual([210, 100]);
  });

  it("keeps the previous position when either collision foot edge is blocked", () => {
    const state = new WorldPlayerState();
    state.setOrigin([100, 100]);
    const passability = { isWalkable: () => false };

    expect(state.move({ x: 1, y: 0 }, 1, passability)).toEqual([100, 100]);
  });
});
