import type { DialogueSentence } from "../domain/conversation";

export const ELD_NPC_LIBRARIAN = "ELD-NPC-010";
export const QUEST_BOOK_EATING_RAT = "eld:book-eating-rat";
export const ITEM_HONEYED_NUT = "honeyed-nut";

export const CLUE_BOOK_EATING_RAT_PAPER = "book-eating-rat:paper";
export const CLUE_BOOK_EATING_RAT_QUIET = "book-eating-rat:quiet";
export const CLUE_BOOK_EATING_RAT_BAIT = "book-eating-rat:bait";

export const LIBRARIAN_AFTER_BOOKMARK: readonly DialogueSentence[] = [
  { id: "librarian-after-bookmark-1", text: "あ、ちょっといいですか。", clueIds: [] },
  { id: "librarian-after-bookmark-2", text: "最近、閉館後に本棚が荒らされているんです。", clueIds: [] },
  { id: "librarian-after-bookmark-3", text: "戸締まりはしているんですが……誰がやっているのか分からなくて。", clueIds: [] },
];

export const BOOK_EATING_RAT_CLUE_SENTENCES: readonly DialogueSentence[] = [
  {
    id: "book-eating-rat-paper",
    text: "昔、紙ばかりかじる小さな鼠を見たことがある。",
    clueIds: [CLUE_BOOK_EATING_RAT_PAPER],
  },
  {
    id: "book-eating-rat-quiet",
    text: "ああいう鼠は、人がいなくなって静かになってから出てくる。",
    clueIds: [CLUE_BOOK_EATING_RAT_QUIET],
  },
  {
    id: "book-eating-rat-bait",
    text: "甘い匂いのする木の実を置いておくと寄ってくる。",
    clueIds: [CLUE_BOOK_EATING_RAT_BAIT],
  },
];
