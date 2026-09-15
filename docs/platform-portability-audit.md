# プラットフォーム移植性監査

**監査日：2026-09-16**  
**方針正本：** `fg79sw4nvw-dot/untold-wiki/governance/platform-portability.md`  
**実装修正完了点：** `98e89dc4fa213b335681aa35df43b84ec6239b95`

## 目的

既に実装済みの範囲を、Web/PWAを現在の主要実行環境としつつ、将来iOS / Android / PC等へ展開するときにゲーム本体を再実装しなくて済む境界になっているか監査した。

今回の監査はゲーム内容・演出・数値を変更するものではなく、既存の確定仕様を維持したまま、ゲーム状態・表示・入力・ブラウザ固有処理の責務を整理するためのもの。

## 監査した主な範囲

- PWA起動処理
- セーブ形式と保存媒体の境界
- 図書館内の主人公位置・向き・自由操作状態
- 図書館の固定障害物との衝突判定
- 初回記録チュートリアルの進行フェーズ
- ワールド移動状態とCanvas描画
- 地形通行判定と画像読込
- ゲーム層に残るカメラ・マップ遷移等の計算処理

## 要修正だった箇所と対応

### 1. 図書館の主人公状態が表示層に寄っていた

以前は図書館表示クラスが主人公位置・向きを保持していた。

対応後は `src/game/library-player-state.ts` を正本状態とし、DOMはその状態を描画するだけにした。

### 2. 図書館の進行フェーズがDOM側へ寄っていた

自由操作可否等に使うフェーズを表示側のdatasetへ持たせる構造を廃止し、`src/game/library-interaction-state.ts` へ移した。

No.01取得フロー、No.55導入、初回記録チュートリアルも同じ状態境界を使用する。

### 3. 図書館の衝突判定がDOM寸法へ依存していた

以前は表示済み要素の `getBoundingClientRect()` から固定障害物を逆算していた。

対応後は `src/game/library-collision.ts` が確定済み図書館レイアウトデータからゲーム座標上の障害物を構築する。描画方法を変更しても同じ衝突データを利用できる。

### 4. ワールド移動とCanvas描画が同じゲーム層クラスに混在していた

旧 `src/game/world-view.ts` は、主人公位置、移動計算、キーボード入力、Canvas描画、AnimationFrameを1クラスで扱っていた。

対応後は以下へ分離した。

- `src/game/world-player-state.ts`: ゲーム座標・移動計算
- `src/ui/world-view.ts`: Canvas描画・Keyboard・AnimationFrame

旧 `src/game/world-view.ts` は削除した。

### 5. 地形通行判定がブラウザCanvasで画像を直接読んでいた

旧 `src/game/passability.ts` は `document`、`Image`、Canvasを直接使用していた。

対応後は以下へ分離した。

- `src/game/passability.ts`: RGBAラスタを受け取って通行可否を判定する純粋なゲーム処理
- `src/platform/browser-passability-mask.ts`: ブラウザで画像を読んでRGBAへ変換するアダプタ

橋の通行判定等、既存のゲーム上の判定は維持した。

### 6. PWAとセーブ保存先

PWAのService Worker登録は `src/platform/pwa.ts` に隔離済み。

セーブ形式は `src/domain/save-data.ts`、保存媒体の契約は `src/platform/save-persistence.ts` として分離されており、この方針は今回変更不要と判断した。

## 変更不要と判断した主な部分

- `src/domain` のゲーム状態・条件・記録・依頼・所持品等の主要データモデル
- `src/game/dead-zone-camera.ts` のカメラ計算
- `src/game/map-transitions.ts` の遷移判定
- `src/game/floating-field-input.ts` の入力ベクトル計算

これらはブラウザDOMやOS固有機能を正本状態として必要とせず、計算・状態ロジックとして再利用可能なため、今回の前提による変更は不要。

## 意図的にUI / platform層へ残しているもの

以下はブラウザ依存であること自体が問題ではなく、置き場所が責務に合っているため残している。

- DOM生成・更新
- Pointer Events
- Keyboard Events
- Canvas描画
- `requestAnimationFrame`
- `window.setTimeout` を使う表示タイミング
- Service Worker
- ブラウザ上での画像デコード
- Safe Area用CSS

これらをゲームロジックへ逆流させないことを今後のガードとする。

## 今回実装していないもの

- Capacitor等のネイティブラッパー
- App Store / Google Play固有SDK
- ネイティブ通知・課金・共有・ハプティクス
- OS固有ストレージ実装
- Canvas等への描画エンジン全面交換

将来対応のための境界だけを整え、現時点で不要なネイティブ技術は先回り実装していない。

## 検証

実装修正完了点 `98e89dc4fa213b335681aa35df43b84ec6239b95` に対するGitHub Actionsの `npm test` と `npm run build` は成功した。

## 結論

今回確認した既存実装について、確定したプラットフォーム移植性方針に明確に反していた主要箇所は修正した。

今後は、新規実装時に `AGENTS.md` とWikiの `governance/platform-portability.md` を参照し、ゲーム状態・ゲーム条件をDOM、入力デバイス、ブラウザAPI、保存媒体へ直接結び付けない状態を維持する。
