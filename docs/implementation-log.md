# 実装ログ

## 0.1.0 — 最初の動作可能版

### 実装した機能

- 確定基礎地形マスクを使うワールド表示。
- キーボードとスマートフォン用方向ボタンによる110px/sの移動。
- 32px幅の足元衝突判定と水域への進入防止。
- 確定座標8都市、確定4街道、確定3橋の開発表示。
- 開始地点を仕様化しないための開発用起点選択。
- BOOKの指定ポケット第1ページ（未取得No.01〜09）。
- HP・空腹・ジェニー・時間は初期値未確定のため値を `--` 表示。

### 参照したWikiページ・資産

- `pages/development/implementation.md`
- `pages/world/world-map.md`
- `pages/world/terrain-allocation-final.md`
- `pages/world/world-rivers-lakes-crossings.md`
- `pages/world/region-mask.md`
- `pages/world/map-transitions.md`
- `pages/world/towns.md`
- `pages/systems/book.md`
- `pages/systems/cards.md`
- `pages/systems/free-pocket.md`
- `pages/systems/recording.md`
- `pages/systems/time-weather.md`
- `pages/systems/encounters.md`
- `pages/systems/economy.md`
- `pages/systems/spells.md`
- `pages/open-items.md`
- `assets/elden-terrain-mask-final.svg`
- `assets/card-template-reference.jpg`
- `assets/game-screen-reference.webp`

### 未確定・TODO

- 4000×2500の地形IDマスクと地域IDマスクを正本へ追加後、両判定を実装する。
- 正式な主人公スプライトとゲーム開始座標の確定後、開発用起点選択を開始フローへ置換する。
- マレスタ・スカルド座標を正規化後、町データへ追加する。
- 探索済み判定方式の確定後、MAPを有効化する。
- CARDの指す画面と初期所持データが確定後、CARDを有効化する。
- 一部のWebP資産が画像ではなくHTMLとして格納されているため、正しい画像へ置換後に基準ビジュアルを実装へ反映する。
