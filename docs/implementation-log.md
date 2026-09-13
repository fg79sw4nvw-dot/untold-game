# 実装ログ

## 0.2.0 — 確定システム基盤

### 実装した機能

- 3本の主要橋について、確定した中心・角度・全長・通行可能幅96pxを使った徒歩通行上書き。
- 指定ポケットNo.01〜99の11ページ表示、矢印移動、左右スワイプ。
- BOOK内のフリーポケット、記録、レシピ確認用の最小開発UI。
- フリーポケット7分類、180枠、素材のみ最大99個のスタック処理。
- 満杯時に新規カードを自動取得せず、整理が必要であることを返す処理。
- 着用枠1・汎用枠2への装備、入れ替え、満杯時の取り外し禁止に対応する状態処理。
- 記録99件上限、複数clueId、削除時のclueId保持数、検索、並べ替えの状態処理。
- 初期時刻を外部から受け取る時間エンジン。現実1秒=ゲーム内2分、3日ごとの季節循環、時間帯区分、停止状態に対応。

### 実装を有効化していない部分

- 初期時刻・季節が未確定のため、時間エンジンはHUDへ接続していない。
- アイテム・装備の個別データが未確定のため、フリーポケットへサンプルカードを追加していない。
- 記録可能な実会話・文章データがないため、記録画面へサンプル記録を追加していない。
- マーク4種類の名称・色・アイコンが未確定のため、マークUIを実装していない。
- 山岳の急斜面・稜線の正確な衝突レイヤーが未収録のため、山岳横断制限は未実装。

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
