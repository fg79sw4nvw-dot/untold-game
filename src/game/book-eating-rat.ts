import { ELD_LIBRARY_ID } from "../data/eld-tutorial";
import { ITEM_HONEYED_NUT, QUEST_BOOK_EATING_RAT } from "../data/eld-content";
import type { TimeBand } from "../domain/clock";
import { consumeOne, type PocketEntry } from "../domain/inventory";
import { ProgressState } from "../domain/progress";
import { QuestTracker } from "../domain/quests";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { SpecifiedCardAcquisition } from "./specified-card-acquisition";

export const CARD_BOOK_EATING_RAT = 55;
export const BOOK_RAT_INTRO_SEEN = "book-rat:intro-seen";
export const BOOK_RAT_BAIT_PLACED = "book-rat:bait-placed";
export const BOOK_RAT_SHADOW_PRESENT = "book-rat:shadow-present";

export type RatInvestigationContext = {
  locationId: string;
  timeBand: TimeBand;
  inventory: readonly PocketEntry[];
};

export class BookEatingRatFlow {
  private readonly acquisition: SpecifiedCardAcquisition;

  constructor(
    private readonly progress: ProgressState,
    private readonly quests: QuestTracker,
    private readonly cards: SpecifiedCardCollection,
  ) {
    this.acquisition = new SpecifiedCardAcquisition(cards);
  }

  canTriggerIntro(): boolean {
    return this.cards.has(1) && !this.progress.has(BOOK_RAT_INTRO_SEEN);
  }

  markIntroSeen(): boolean {
    if (!this.canTriggerIntro()) return false;
    this.progress.set(BOOK_RAT_INTRO_SEEN);
    return true;
  }

  startFormalQuest(nextDayReached = false): boolean {
    if (!this.progress.has(BOOK_RAT_INTRO_SEEN) || !nextDayReached) return false;
    return this.quests.start(QUEST_BOOK_EATING_RAT);
  }

  canOfferBaitPrompt(context: RatInvestigationContext): boolean {
    return this.quests.status(QUEST_BOOK_EATING_RAT) === "active"
      && context.locationId === ELD_LIBRARY_ID
      && context.timeBand === "night"
      && context.inventory.some(entry => entry.definitionId === ITEM_HONEYED_NUT)
      && !this.progress.has(BOOK_RAT_BAIT_PLACED)
      && !this.cards.has(CARD_BOOK_EATING_RAT);
  }

  placeBait(context: RatInvestigationContext): { placed: boolean; inventory: PocketEntry[] } {
    if (!this.canOfferBaitPrompt(context)) return { placed: false, inventory: [...context.inventory] };
    const consumed = consumeOne(context.inventory, ITEM_HONEYED_NUT);
    if (!consumed.consumed) return { placed: false, inventory: consumed.inventory };
    this.progress.set(BOOK_RAT_BAIT_PLACED);
    return { placed: true, inventory: consumed.inventory };
  }

  waitForShadow(): boolean {
    if (!this.progress.has(BOOK_RAT_BAIT_PLACED) || this.cards.has(CARD_BOOK_EATING_RAT)) return false;
    this.progress.set(BOOK_RAT_SHADOW_PRESENT);
    return true;
  }

  contactShadow() {
    if (!this.progress.has(BOOK_RAT_SHADOW_PRESENT)) return null;
    const result = this.acquisition.acquire(CARD_BOOK_EATING_RAT);
    if (!result.acquired) return null;
    this.progress.clear(BOOK_RAT_SHADOW_PRESENT);
    return result.definition;
  }

  reportToLibrarian(): boolean {
    if (!this.cards.has(CARD_BOOK_EATING_RAT)) return false;
    return this.quests.complete(QUEST_BOOK_EATING_RAT);
  }
}
