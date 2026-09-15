# UNTOLD Game - Implementation Guard

このリポジトリは `fg79sw4nvw-dot/untold-wiki` / `main` の確定仕様だけを実装する。

## 正本

- ゲーム仕様：`fg79sw4nvw-dot/untold-wiki`
- 制作 → 実装 → GitHub / Vercel → 実機確認の工程：`pages/development/production-workflow.md`
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
- 同じwork unitの関連修正は、検証可能なまとまりで `main` へ反映する。実機確認のたびに意味の薄い小分けコミットを量産しない。
- `main` 更新後はGitHub CIの成功を確認する。CI失敗中は実装完了扱いにしない。
- Vercelでの確認が必要な場合は、Production DeploymentのGitHub commit SHAが確認対象の `main` SHAと一致し、成功してから「本番反映済み」「実機確認可能」と扱う。
- Vercelが古いREADYデプロイを返していても、SHAが一致しなければ最新実装とは扱わない。
- 接続切断や別チャットへの引き継ぎでは、会話上の進捗より `untold-wiki` / `untold-game` のHEAD、直前の関連コミット、CI、VercelのSHAを優先して復元する。

## Vercel運用

- 自動デプロイは原則 `main` のみにする。
- 作業枝・復旧枝・実験枝のPreview Deploymentは、明示的に必要な場合を除き自動作成しない。
- `main` は実機確認・公開動作確認へ直結するため、原則としてProduction Deployment対象とする。
- ビルドレート制限等でデプロイできない場合、GitHub `main` は実装の正本として維持するが、本番URLは旧版として扱う。

このガードは、同じゲーム本体をWeb/PWA、iOS/Androidラッパー、PCブラウザ等で再利用しやすくしつつ、Wiki・GitHub・Vercel・実機確認の状態を混同しないためのもの。ゲーム内容をプラットフォームごとに分岐させない。
