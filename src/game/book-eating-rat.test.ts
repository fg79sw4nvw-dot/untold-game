import { describe, expect, it } from "vitest";
import { ELD_LIBRARY_ID } from "../data/eld-tutorial";
import { ITEM_HONEYED_NUT, QUEST_BOOK_EATING_RAT } from "../data/eld-content";
import type { PocketEntry } from "../domain/inventory";
import { ProgressState } from "../domain/progress";
import { QuestTracker } from "../domain/quests";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { BookEatingRatFlow } from "./book-eating-rat";

const honeyedNutFixture = (): PocketEntry => ({
  instanceId: "test-honeyed-nut",
  definitionId: ITEM_HONEYED_NUT,
  category: "other",
});

describe("No.55 confirmed progression", () => {
  it("runs from post-No.01 introduction through librarian report without inventing a wait duration", () => {
    const progress = new ProgressState();
    const quests = new QuestTracker();
    const cards = new SpecifiedCardCollection();
    cards.acquire(1);
    const flow = new BookEatingRatFlow(progress, quests, cards);

    expect(flow.canTriggerIntro()).toBe(true);
    expect(flow.markIntroSeen()).toBe(true);
    expect(flow.startFormalQuest()).toBe(true);
    expect(quests.status(QUEST_BOOK_EATING_RAT)).toBe("active");

    const inventory = [honeyedNutFixture()];
    expect(flow.canOfferBaitPrompt({ locationId: ELD_LIBRARY_ID, timeBand: "day", inventory })).toBe(false);
    expect(flow.canOfferBaitPrompt({ locationId: "eld-town", timeBand: "night", inventory })).toBe(false);
    expect(flow.canOfferBaitPrompt({ locationId: ELD_LIBRARY_ID, timeBand: "night", inventory })).toBe(true);

    const placement = flow.placeBait({ locationId: ELD_LIBRARY_ID, timeBand: "night", inventory });
    expect(placement.placed).toBe(true);
    expect(placement.inventory.some(entry => entry.definitionId === ITEM_HONEYED_NUT)).toBe(false);

    expect(flow.waitForShadow()).toBe(true);
    const card = flow.contactShadow();
    expect(card?.number).toBe(55);
    expect(cards.has(55)).toBe(true);

    expect(flow.reportToLibrarian()).toBe(true);
    expect(quests.status(QUEST_BOOK_EATING_RAT)).toBe("completed");
  });

  it("does not mechanically require recorded clueIds where the card page does not explicitly define that gate", () => {
    const quests = new QuestTracker();
    const cards = new SpecifiedCardCollection([1] as never);
    const flow = new BookEatingRatFlow(new ProgressState(), quests, cards);
    expect(flow.canTriggerIntro()).toBe(false);
  });
});
