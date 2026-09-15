export const OPENING_MONOLOGUE = [
  "気にしなくていいことなんて、たくさんある。",
  "きっと、みんなはそうやって暮らしている。",
  "分からなくても、困らないこともある。",
  "それは分かっている。",
  "分かっているのに、気になってしまう。",
  "答えなんてないのかもしれない。",
  "それでも、考えるのをやめられない。",
] as const;

// Wiki currently uses about four seconds per line as a provisional basis.
export const OPENING_MONOLOGUE_PROVISIONAL_LINE_MS = 4000;

export const LIBRARY_SORTING_PAUSE_MS = 1000;
export const LIBRARY_BOOK_DISCOVERY_PAUSE_MS = 1000;
export const BOOK_DISCOVERY_TO_ACQUIRE_MS = 500;

export const FIRST_BOOK_CLOSED_PAUSE_MS = 1000;
export const FIRST_BOOK_TITLE_PAUSE_MS = 1000;
export const FIRST_BOOK_MESSAGE_INPUT_LOCK_MS = 5000;

export const AFTER_FIRST_BOOK_THOUGHT_TO_LIBRARIAN_MOVE_MS = 300;
export const LIBRARIAN_REPORT_START_PAUSE_MS = 300;
export const LIBRARIAN_BOOK_INSPECTION_PAUSE_MS = 1000;
export const LIBRARIAN_OBSERVES_PROTAGONIST_PAUSE_MS = 1000;
export const LIBRARIAN_AFTER_SELF_ONLY_THOUGHT_PAUSE_MS = 300;
export const LIBRARIAN_AFTER_FAREWELL_TO_FREE_MS = 300;

export const BOOKMARK_THOUGHT_TO_CARDIZATION_MS = 500;
export const BOOKMARK_CARDIZATION_PRESENTATION_MS = 3000;
export const BOOKMARK_AFTER_CARDIZATION_TO_THOUGHT_MS = 500;
export const BOOKMARK_AFTER_THOUGHT_TO_FREE_MS = 300;
export const BOOK_RAT_EXIT_STOP_TO_CALL_MS = 300;
export const BOOK_RAT_TURN_TO_DIALOGUE_MS = 300;

export const BOOK_RAT_INTRO_TO_FIRST_RECORDING_THOUGHT_MS = 500;
export const FIRST_RECORD_COMPLETE_TO_LIST_MS = 300;
export const FIRST_RECORD_LIST_CLOSE_TO_THOUGHT_MS = 500;
export const FIRST_RECORD_FINAL_THOUGHT_TO_FREE_MS = 300;

export const LIBRARY_OPENING_DIALOGUE = [
  { speaker: "司書", text: "いつも手伝ってくれて、ありがとう。" },
  { speaker: "主人公", text: "好きでやってるだけなんで。" },
] as const;

export const BOOK_DISCOVERY_THOUGHT = "（ん……？ この本は……？）";
export const FIRST_BOOK_TITLE_THOUGHT = "（……え？ 文字が……）";

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

export const LIBRARIAN_REPORT_BEFORE_INSPECTION_END = 5;
export const LIBRARIAN_REPORT_BEFORE_OBSERVATION_END = 8;
export const LIBRARIAN_REPORT_SELF_ONLY_THOUGHT_INDEX = 9;

export const LIBRARIAN_REPEAT_BEFORE_BOOKMARK = "気をつけて帰ってね。";
export const LIBRARIAN_AFTER_BOOKMARK_DIALOGUE = [
  { speaker: "司書", text: "どうしたの？　まだ何か気になる？" },
  { speaker: null, text: "（……いや、まだ自分でもよく分かってない。）" },
] as const;
export const BASEMENT_LOCKED_OBSERVATION = "（鍵がかかっている。）";
export const BOOKMARK_FOUND_THOUGHT = "（栞が落ちてる。司書さんに渡しておくか。）";
export const BOOKMARK_AFTER_CARDIZATION_THOUGHT = "（……今の、何だ？）";
export const BOOKMARK_EXIT_NOTICE_THOUGHT = "（……あれは？）";

export const FIRST_RECORDING_THOUGHTS = [
  "（そういえば……あの本に、気になったことを書き留めておけるって書いてあったな。）",
  "（でも、どうやって……？）",
] as const;
export const FIRST_RECORDING_COMPLETE_THOUGHT = "（……これが、書き留めるってことか。）";

export const OPENING_UI_KNOWLEDGE = {
  bookKnownAfterAcquisition: true,
  recordButtonVisibleBeforeFirstRecordingTutorial: false,
  cardizationConceptVisibleBeforeFirstCardization: false,
  cardNumberVisibleBeforeFirstCardization: false,
  specifiedPocketVisibleBeforeFirstCardization: false,
} as const;
