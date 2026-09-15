import { describe, expect, it } from "vitest";
import { BRIDGES } from "../data/world";
import { PassabilityMask } from "./passability";

function onePixel(red: number, green: number, blue: number): PassabilityMask {
  return new PassabilityMask({
    width: 1,
    height: 1,
    rgba: new Uint8ClampedArray([red, green, blue, 255]),
  });
}

describe("PassabilityMask", () => {
  it("samples land without browser canvas state", () => {
    expect(onePixel(255, 255, 255).isWalkable(1, 1)).toBe(true);
    expect(onePixel(0, 0, 0).isWalkable(1, 1)).toBe(false);
  });

  it("keeps confirmed bridge areas walkable independently of the raster", () => {
    const [x, y] = BRIDGES[0].center;
    expect(onePixel(0, 0, 0).isWalkable(x, y)).toBe(true);
  });

  it("rejects coordinates outside the world", () => {
    const mask = onePixel(255, 255, 255);
    expect(mask.isWalkable(-1, 0)).toBe(false);
  });
});
