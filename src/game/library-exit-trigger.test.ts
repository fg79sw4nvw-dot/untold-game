import { describe, expect, it } from "vitest";
import { attemptsLibraryExit } from "./library-exit-trigger";

describe("attemptsLibraryExit", () => {
  it("triggers only when moving down through the confirmed bottom-center opening", () => {
    expect(attemptsLibraryExit({ x: 320, y: 1015 }, { x: 0, y: 2 })).toBe(true);
    expect(attemptsLibraryExit({ x: 200, y: 1015 }, { x: 0, y: 2 })).toBe(false);
    expect(attemptsLibraryExit({ x: 320, y: 1015 }, { x: 0, y: -2 })).toBe(false);
    expect(attemptsLibraryExit({ x: 320, y: 900 }, { x: 0, y: 2 })).toBe(false);
  });
});
