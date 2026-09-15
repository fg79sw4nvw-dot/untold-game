import {
  CLUE_BOOK_EATING_RAT_BAIT,
  CLUE_BOOK_EATING_RAT_PAPER,
  CLUE_BOOK_EATING_RAT_SHADOW,
} from "./eld-content";
import {
  CARD_NO_BOOK_EATING_RAT,
  CARD_NO_FORGOTTEN_BOOKMARK,
} from "./specified-card-definitions";

export const ELD_LIBRARY_ID = "eld-library";

// Compatibility export for existing tutorial code. The stable clue IDs live in
// eld-content.ts so No.55 cannot drift into a second identifier family.
export const BOOK_RAT_CLUES = {
  smallLivingShadow: CLUE_BOOK_EATING_RAT_SHADOW,
  paperEatingMouse: CLUE_BOOK_EATING_RAT_PAPER,
  attractedBySweetFruit: CLUE_BOOK_EATING_RAT_BAIT,
} as const;

export const CONFIRMED_ELD_CARD_IDS = {
  forgottenBookmark: CARD_NO_FORGOTTEN_BOOKMARK,
  bookEatingRat: CARD_NO_BOOK_EATING_RAT,
} as const;
