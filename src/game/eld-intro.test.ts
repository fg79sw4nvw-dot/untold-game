import { describe, expect, it } from "vitest";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { CARD_FORGOTTEN_BOOKMARK, EldIntroFlow } from "./eld-intro";

describe("Eld intro confirmed flow", () => {
  it("blocks the library exit after receiving the book until No.01 is acquired", () => {
    const progress = new ProgressState();
    const cards = new SpecifiedCardCollection();
    const flow = new EldIntroFlow(progress, cards);

    expect(flow.shouldShowBookmarkLight()).toBe(false);
    expect(flow.attemptLibraryExit().allowed).toBe(true);

    flow.markBookAcquired();
    expect(flow.shouldShowBookmarkLight()).toBe(true);
    expect(flow.attemptLibraryExit()).toEqual({
      allowed: false,
      message: "なにか見落としている気がする",
    });

    expect(flow.inspectBookmarkLight()).toBe(true);
    expect(cards.has(CARD_FORGOTTEN_BOOKMARK)).toBe(true);
    expect(flow.shouldShowBookmarkLight()).toBe(false);
    expect(flow.attemptLibraryExit().allowed).toBe(true);
  });

  it("does not acquire the same specified card twice", () => {
    const cards = new SpecifiedCardCollection();
    expect(cards.acquire(CARD_FORGOTTEN_BOOKMARK)).toBe(true);
    expect(cards.acquire(CARD_FORGOTTEN_BOOKMARK)).toBe(false);
    expect(cards.values()).toEqual([CARD_FORGOTTEN_BOOKMARK]);
  });
});
