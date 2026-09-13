export type SpecifiedCardDefinition = {
  number: number;
  name: string;
  description: string;
  illustrationUrl: string;
};

const WIKI_ASSET_ROOT = "https://raw.githubusercontent.com/fg79sw4nvw-dot/untold-wiki/main/assets";

export const SPECIFIED_CARD_DEFINITIONS: ReadonlyMap<number, SpecifiedCardDefinition> = new Map([
  [1, {
    number: 1,
    name: "忘れられた栞",
    description: "どこかの本に挟まっていた、古びた栞。長いあいだ、誰かの物語に寄り添ってきたのだろう。",
    illustrationUrl: `${WIKI_ASSET_ROOT}/card-001-forgotten-bookmark.webp`,
  }],
  [55, {
    number: 55,
    name: "書喰い鼠",
    description: "紙や本をかじる、小さな鼠。静かな夜、文字の匂いに誘われて、どこからともなく現れる。",
    illustrationUrl: `${WIKI_ASSET_ROOT}/card-055-book-eating-rat.webp`,
  }],
]);
