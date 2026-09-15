# UNTOLD Game - Implementation Guard

このリポジトリは `fg79sw4nvw-dot/untold-wiki` / `main` の確定仕様だけを実装する。

## 正本

- ゲーム仕様：`fg79sw4nvw-dot/untold-wiki`
- プラットフォーム移植性・ストア対応の実装ガード：`governance/platform-portability.md`
- セーブ形式：`pages/development/save-data-model.md`
- アセット配信：`pages/development/asset-pipeline.md`

## 実装ルール

- `src/domain` 等のゲームロジック層から `window` / `document` / `navigator` / `localStorage` / Service Worker / iOS・Android固有API / ストアSDKを直接呼ばない。
- セーブデータ形式と保存媒体を分離する。ブラウザ保存や将来のOS保存はアダプタ側で扱う。
- 主人公・NPC・イベント等の正本状態はゲーム座標・ゲーム状態として保持し、DOM要素の位置を正本状態にしない。
- タッチ・マウス・キーボード等の入力方式をストーリー条件やカード取得条件へ埋め込まない。
- PWA固有処理はゲーム進行ロジックから分離する。
- 実行用アセットはゲーム用パスから参照し、制作Wikiのraw URLへランタイムで常時依存しない。
- 将来のApp Store / Google Play対応を理由に、現時点で未要求のネイティブ機能やラッパー技術を先回り実装しない。境界だけ維持する。

このガードは、同じゲーム本体をWeb/PWA、iOS/Androidラッパー、PCブラウザ等で再利用しやすくするためのもの。ゲーム内容をプラットフォームごとに分岐させない。
