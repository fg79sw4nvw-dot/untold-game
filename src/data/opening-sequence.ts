export const OPENING_MONOLOGUE = [
  "（気にしなくていいことなんて、たくさんある。）",
  "（きっと、みんなはそうやって暮らしている。）",
  "（分からなくても、困らないこともある。）",
  "（それは分かっている。）",
  "（分かっているのに、気になってしまう。）",
  "（答えなんてないのかもしれない。）",
  "（それでも、考えるのをやめられない。）",
] as const;

// Wiki currently uses about four seconds per line as a provisional basis.
export const OPENING_MONOLOGUE_PROVISIONAL_LINE_MS = 4000;

export const GAME_MASTER_FIRST_MESSAGE = [
  "これを読めているなら、少なくとも少しは物好きらしい。",
  "知らないものを、そのままにしておけないことはあるか。",
  "もしそうなら、この本を使ってみろ。",
  "この世界には、まだ知られていないものがいくらでもある。\nその中から九十九を見つけて、この本を埋めてみろ。",
  "それから、この本には気になったことを書き留めておくこともできる。",
  "……何を言ってるのか分からないか？",
  "まあいい。\nそのうち分かる。",
  "全部集めるころには、知りたかったことも分かっているだろう。",
  "やるかどうかは好きにしろ。\n途中で飽きたなら、それまでだ。",
] as const;

export const PROTAGONIST_AFTER_FIRST_BOOK_READING = "（どういうことだ……？）";

export const LIBRARIAN_BOOK_REPORT_DIALOGUE = [
  { speaker: "主人公", text: "この本……読めた。" },
  { speaker: "司書", text: "読めた？" },
  { speaker: "主人公", text: "文字が書いてある。" },
  { speaker: "司書", text: "……そんなわけないでしょう。" },
  { speaker: "司書", text: "見せて。" },
  { speaker: "司書", text: "……何も書いてないよ。" },
  { speaker: "主人公", text: "でも、さっきは……" },
  { speaker: "司書", text: "いつもの本と同じ。" },
  { speaker: "司書", text: "顔色、あまりよくないけど大丈夫？" },
  { speaker: null, text: "（自分にしか、見えてない……？）" },
  { speaker: "主人公", text: "……今日は、もう帰っていい？" },
  { speaker: "司書", text: "うん、いいよ。" },
  { speaker: "主人公", text: "この本、持って帰ってもいい？" },
  { speaker: "司書", text: "うん。気になるなら持っていって。" },
  { speaker: "司書", text: "気をつけて帰ってね。" },
] as const;

// These two opening dialogue beats are confirmed semantically, but their exact
// displayed wording is not fixed in the Wiki. They are kept as intents rather
// than invented lines.
export const LIBRARY_OPENING_UNFIXED_DIALOGUE_INTENTS = [
  "司書が、主人公が日頃から図書館を手伝っていることへの感謝を伝える。",
  "主人公が、好きでやっているだけという趣旨の短い発話を返す。",
] as const;

export const LIBRARIAN_REPEAT_BEFORE_BOOKMARK = "気をつけて帰ってね。";
export const BASEMENT_LOCKED_OBSERVATION = "（鍵がかかっている。）";
export const BOOKMARK_FOUND_THOUGHT = "（栞が落ちてる。司書さんに渡しておくか。）";
export const BOOKMARK_AFTER_CARDIZATION_THOUGHT = "（……今の、何だ？）";
export const LIBRARY_EXIT_BLOCKED_MESSAGE = "なにか見落としている気がする";

export const FIRST_RECORDING_THOUGHTS = [
  "（そういえば……あの本に、気になったことを書き留めておけるって書いてあったな。）",
  "（でも、どうやって……？）",
] as const;

export const OPENING_UI_KNOWLEDGE = {
  bookKnownAfterAcquisition: true,
  recordButtonVisibleBeforeFirstRecordingTutorial: false,
  cardizationConceptVisibleBeforeFirstCardization: false,
  cardNumberVisibleBeforeFirstCardization: false,
  specifiedPocketVisibleBeforeFirstCardization: false,
} as const;
