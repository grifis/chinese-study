# 初回構築の検証記録

2026-10-14 / Node.js v24.19.0 / pnpm 11.25.0

- pnpm install：成功。pnpm-workspace.yamlでesbuildのみビルドスクリプトを許可。
- pnpm check：エラー0、警告0。
- pnpm test：26テスト成功（教材品質17、SSR表示9）。
- pnpm validate：第26課のZod・掲載数・文法例文数・候補数・解答数・練習群数が整合。
- pnpm build：成功。依存Zod内コメントについてRollupの無害な注釈警告あり。adapter-autoの本番環境未検出はローカル専用の構成上の想定どおり。
- pnpm dev：5173番で起動成功。
- HTTP確認：一覧・第26課メニュー・全8学習画面が200。SSRの全項目ID・クイズ全問が存在。拼音/日本語offでも中国語本文が残る。不正課・不正学習項目は404。
- git init：mainブランチ。remoteなし。push・公開なし。

未実施：iPhone Safari実機操作・視覚的なブラウザ確認、専門家による全補足の校閲。音声は原資料として未提供。

原本の照合範囲・数え方は content/lessons/lesson-26/source/inventory.md。未確認点は lesson.json の issues と課メニューの照合記録で確認できる。

## GitHub Pages対応の検証

2026-10-14：ユーザーの追加依頼により静的公開に対応。

- adapter-staticによる全10ページの事前生成に変更。
- チェックボックスとCSSで拼音・日本語訳を切り替える方式に変更し、静的ホスト・JS無効に対応。
- pnpm check：エラー0、警告0。
- pnpm test：26件成功。pnpm validate：成功。
- BASE_PATH=/chinese-studyのビルド・pnpm test:static：成功。
- BASE_PATHなしのルート公開ビルド・pnpm test:static：成功。
- 全項目・クイズ・リンク・CSS参照・原本画像非公開を検証。
- .github/workflows/pages.ymlで検証後にGitHub Pagesへ公開する構成を追加。
- 教科書写真と元HTMLはGit管理・公開の対象から除外し、ローカルに保持。
