import { describe, expect, it } from "vitest";
import {
  FIELD_MOVE_SPEED_PX_PER_SECOND,
  FloatingFieldInput,
  movementDelta,
} from "./floating-field-input";

describe("floating field input", () => {
  it("treats releases under 18px as taps", () => {
    const input = new FloatingFieldInput();
    input.begin({ x: 100, y: 100 });
    expect(input.update({ x: 117, y: 100 })).toEqual({ kind: "tap-candidate" });
    expect(input.end({ x: 117, y: 100 })).toEqual({ kind: "tap" });
  });

  it("switches to movement at 18px and never returns to tap during the same touch", () => {
    const input = new FloatingFieldInput();
    input.begin({ x: 100, y: 100 });
    expect(input.update({ x: 118, y: 100 })).toEqual({
      kind: "move",
      direction: { x: 1, y: 0 },
    });
    expect(input.update({ x: 104, y: 100 })).toEqual({
      kind: "move",
      direction: { x: 1, y: 0 },
    });
    expect(input.end({ x: 104, y: 100 })).toEqual({ kind: "move-end" });
  });

  it("normalizes direction so finger distance never changes movement speed", () => {
    const input = new FloatingFieldInput();
    input.begin({ x: 0, y: 0 });
    const near = input.update({ x: 18, y: 0 });
    const far = input.update({ x: 180, y: 0 });
    expect(near).toEqual({ kind: "move", direction: { x: 1, y: 0 } });
    expect(far).toEqual({ kind: "move", direction: { x: 1, y: 0 } });

    expect(movementDelta({ x: 1, y: 0 }, 1)).toEqual({
      x: FIELD_MOVE_SPEED_PX_PER_SECOND,
      y: 0,
    });
  });
});
