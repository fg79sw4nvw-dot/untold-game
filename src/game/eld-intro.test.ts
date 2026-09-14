import { describe, expect, it } from "vitest";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";
import { CARD_FORGOTTEN_BOOKMARK, EldIntroFlow } from "./eld-intro";

describe("Eld intro confirmed flow", () => {
  it("blocks exit for No.01, then triggers the No.55 intro before allowing departure", () => {
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

    expect(flow.librarianRepeatLine()).toBe("気をつけて帰ってね。");
    expect(flow.inspectBasementDoor()).toBe("（鍵がかかっている。）");

    expect(flow.inspectBookmarkLight()).toBe(true);
    expect(cards.has(CARD_FORGOTTEN_BOOKMARK)).toBe(true);
    expect(flow.shouldShowBookmarkLight()).toBe(false);
    expect(flow.attemptLibraryExit()).toEqual({
      allowed: false,
      triggerBookRatIntro: true,
    });

    progress.set(BOOK_RAT_INTRO_SEEN);
    expect(flow.attemptLibraryExit()).toEqual({ allowed: true });
  });

  it("does not acquire the same specified card twice", () => {
    const cards = new SpecifiedCardCollection();
    expect(cards.acquire(CARD_FORGOTTEN_BOOKMARK)).toBe(true);
    expect(cards.acquire(CARD_FORGOTTEN_BOOKMARK)).toBe(false);
    expect(cards.values()).toEqual([CARD_FORGOTTEN_BOOKMARK]);
  });
});
