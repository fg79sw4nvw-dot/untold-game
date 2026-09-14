import { describe, expect, it } from "vitest";
import { ProgressState } from "../domain/progress";
import { QuestTracker } from "../domain/quests";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { BookEatingRatFlow, BOOK_RAT_INTRO_SEEN } from "./book-eating-rat";
import { EldIntroFlow } from "./eld-intro";
import { LibraryTutorialController } from "./library-tutorial-controller";

describe("library tutorial sequence bridge", () => {
  it("connects No.01 acquisition to the No.55 intro gate without skipping phases", () => {
    const progress = new ProgressState();
    const cards = new SpecifiedCardCollection();
    const intro = new EldIntroFlow(progress, cards);
    const bookRat = new BookEatingRatFlow(progress, new QuestTracker(), cards);
    const tutorial = new LibraryTutorialController(intro, bookRat);

    expect(tutorial.shouldShowBookmarkLight()).toBe(false);
    intro.markBookAcquired();
    expect(tutorial.shouldShowBookmarkLight()).toBe(true);

    expect(tutorial.beginBookmarkInspection()).toBe(true);
    expect(tutorial.currentBookmarkPhase()).toBe("inspection-thought");
    expect(tutorial.beginBookmarkCardization()?.number).toBe(1);
    expect(tutorial.currentBookmarkPhase()).toBe("cardization");
    expect(cards.has(1)).toBe(true);

    expect(tutorial.markBookmarkCardizationComplete()).toBe(true);
    expect(tutorial.currentBookmarkPhase()).toBe("post-cardization");
    expect(tutorial.finishBookmarkTutorial()).toBe(true);
    expect(tutorial.currentBookmarkPhase()).toBe("complete");

    expect(tutorial.attemptLibraryExit()).toEqual({ allowed: false, triggerBookRatIntro: true });
    const lines = tutorial.beginBookRatIntro();
    expect(lines?.[0].text).toBe("あ、そうだ。ちょっとだけいい？");
    expect(tutorial.finishBookRatIntro()).toBe(true);
    expect(progress.has(BOOK_RAT_INTRO_SEEN)).toBe(true);
    expect(tutorial.attemptLibraryExit()).toEqual({ allowed: true });
  });
});
