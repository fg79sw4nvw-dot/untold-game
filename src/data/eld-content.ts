import type { DialogueSentence } from "../domain/conversation";

export const ELD_NPC_LIBRARIAN = "ELD-NPC-010";
export const ELD_NPC_EAST_YOUTH = "ELD-NPC-019";
export const ELD_NPC_ANTIQUE_DEALER = "ELD-NPC-020";

export const QUEST_BOOK_EATING_RAT = "eld:book-eating-rat";
export const ITEM_HONEYED_NUT = "honeyed-nut";

export const CLUE_BOOK_EATING_RAT_SHADOW = "book-eating-rat:small-living-shadow";
export const CLUE_BOOK_EATING_RAT_PAPER = "book-eating-rat:paper";
export const CLUE_BOOK_EATING_RAT_BAIT = "book-eating-rat:bait";

export const LIBRARIAN_AFTER_BOOKMARK: readonly DialogueSentence[] = [
  { id: "librarian-after-bookmark-1", text: "あ、そうだ。ちょっとだけいい？", clueIds: [] },
  { id: "librarian-after-bookmark-2", text: "最近、閉館したあとに、本棚が荒らされてることがあって。", clueIds: [] },
  { id: "librarian-after-bookmark-3", text: "戸締まりはちゃんとしてるんだけど……誰がやってるのか分からないの。", clueIds: [] },
  { id: "librarian-after-bookmark-4", text: "もし何か気づいたら、教えてくれる？", clueIds: [] },
];

export const BOOK_EATING_RAT_CLUE_SENTENCES = {
  librarian: {
    sourceId: ELD_NPC_LIBRARIAN,
    sentence: {
      id: "book-eating-rat-shadow",
      text: "棚の奥で小さな影を見た。人ではなく生き物のようだった。",
      clueIds: [CLUE_BOOK_EATING_RAT_SHADOW],
    } satisfies DialogueSentence,
  },
  antiqueDealer: {
    sourceId: ELD_NPC_ANTIQUE_DEALER,
    sentence: {
      id: "book-eating-rat-paper",
      text: "昔、紙ばかりかじる小さな鼠を見たことがある。",
      clueIds: [CLUE_BOOK_EATING_RAT_PAPER],
    } satisfies DialogueSentence,
  },
  eastYouth: {
    sourceId: ELD_NPC_EAST_YOUTH,
    sentence: {
      id: "book-eating-rat-bait",
      text: "甘い匂いのする木の実を置いておくと寄ってくる。",
      clueIds: [CLUE_BOOK_EATING_RAT_BAIT],
    } satisfies DialogueSentence,
  },
} as const;

export const BOOK_EATING_RAT_BAIT_PROMPT = "蜜漬け木の実を置きますか？";
