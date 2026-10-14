# ことばのノート — 中国語学習教材

『漢語会話301句』の予習・復習を、教材JSONとCodexで継続管理するローカル開発とGitHub Pagesの静的公開に対応するWebアプリです。iPhone縦画面を優先し、本文・会話・文法・単語・置き換え・広げる・練習・復習クイズを課ごとに閲覧できます。

## 起動

Node.js 22.12以降（24推奨）、pnpm 11系を利用してください。

```sh
cd chinese-study
pnpm install
pnpm dev
```

PCでは `http://localhost:5173`。iPhoneをPCと同じWi-Fiに接続し、Safariで `http://<PCのLAN内IP>:5173` を開きます。devはLANからアクセスできるよう `--host 0.0.0.0` を指定済みです。必要に応じてPCのファイアウォールでローカル開発ポートを許可してください。

```sh
pnpm validate  # 全教材のZod・件数・候補数・練習群チェック
pnpm check     # Svelte / TypeScript
pnpm test      # 必須フィールド・欠落検出・全項目SSR表示
pnpm build     # 本番ビルドの整合性（公開しません）
```

DB・認証・外部APIは使用しません。GitHub Pagesで静的HTMLとして公開できます。フォントも外部配信に依存しません。GitHub Pagesの公開手順は下記を参照してください。

## 使い方

一覧から課を選び、学習項目を開きます。「表示」欄のチェックで拼音・日本語訳をすぐに切り替えられます。詳しい説明・模範解答はタップで開閉できます。復習クイズは選択すると正誤と得点を表示し、リセットできます。

SSRを利用しており、JavaScriptを無効にしても基本教材・解答・解説を読めます。表示切り替えはHTMLのチェックボックスとCSS、開閉はHTMLのdetailsです。CSSの:hasを利用するためiPhoneはiOS 15.4以降が対象です。クイズの自動採点にはJSが必要ですが、正解解説はJSなしでも開けます。学習履歴の保存機能はありません。

## 第26課の移行

提供HTMLと教科書写真5枚（p.52–60）を `content/lessons/lesson-26/source/` に保存しました。8基本文、19発話、23単語、3置換セットと全12候補・12完成文、2広げる、教科書文法6項目＋HTML補足7項目、全練習23表示単位、AIクイズ10問を収録しています。小东西の注釈も保持しています。

画像を照合し、HTMLの「忘了微信」を「发了微信」に修正し、練習の「車が売れない」を原本の「腕時計が壊れた」に修正しました。HTML未収録だった練習1・5・6・7も追加しています。詳しい掲載数・数え方は `source/inventory.md`、修正履歴は `review.json`、画面では課メニュー末尾の照合記録にあります。

**残る確認事項**：拼音・日本語訳・AI模範解答全体の専門家校閲は未実施です。原本の音声は未提供で、聞き取り練習は原文・再話例の閲覧になります。校閲待ち・音声未収録は画面とlesson.issuesに明示しています。AI解答は出版社の公式解答ではありません。

## 新しい課を追加する

1. AGENTS.md と docs/ 配下の3文書を読みます。
2. `content/lessons/lesson-N/source/` に原資料を保存し、`source/inventory.md` で原本の全項目・候補・小問を独立して数えます。
3. 第26課の構造と `src/lib/schemas/lesson.ts` を参考に `lesson.json`、`review.json`、`quiz.json` を作ります。id/number、原文、期待件数、各項目の原文・例文数（expectedSentenceCounts）と解答数（expectedAnswerCounts）を新しい課に合わせます。クイズを作らない場合は `quiz.json` を `[]` にします。
4. 原文・全例文・全候補・全設問を保持し、拼音・訳・解説・解答例を追加します。AIの例文・解答は補足として区別します。不明な原文はnullのneeds-reviewとして記録します。
5. 上記4コマンドを実行し、画面と原資料を照合します。JSONは自動検出されるためルートや一覧の手動更新は不要です。

具体的な作業順序は [lesson-workflow.md](docs/lesson-workflow.md)、データ規則は [content-rules.md](docs/content-rules.md)、完了確認は [quality-checklist.md](docs/quality-checklist.md) を参照してください。期待件数だけを変更して欠落検査を回避しないでください。

## 構成と検証

- `src/lib/schemas/`：Zodの厳格スキーマ。未知のフィールド、必須欠落、重複ID、候補数不整合、不明原文の推測入力を拒否。
- `src/lib/lessons/`：全JSONを読み込み、照合表と検証して一覧化。エラーのある課は黙って除外せず失敗させます。
- `src/lib/components/`：教材表示、出典表示、詳細開閉、クイズ。
- `src/routes/`：一覧、課メニュー、学習項目。URLによる表示切り替え。
- `content/lessons/`：教材、原本照合表、AIクイズ、原資料。
- `tests/`：データ異常注入による欠落検出、全課の全項目・候補・完成文・解答・クイズのSSR出力確認。

原文の要確認は `status: needs-review` で本文・拼音・訳をnullにし、対応するissueを必須にします。拼音・訳の校閲待ちは `annotationStatus` で別管理。件数検証は転記の正しさを保証しないため、目視照合も必要です。

PWAは未実装ですが、サーバー専用DBや認証に依存せず、データと表示を分離しています。将来のmanifest・アイコン・service workerの追加を妨げない構成です。現時点ではオフライン閲覧を保証しません。

この環境ではブラウザの実機操作は未実施です。SSR出力・型検査・ビルドを確認し、iPhone Safariの実機確認はquality-checklistに残しています。


## GitHub PagesでiPhoneから確認する

アプリの全ページをビルド時に静的HTMLへ出力します。GitHub Pages上にサーバーやDBは不要です。教材の追加・更新後にmainへpushすると、検証とビルドが通った版をGitHub Actionsが公開します。

1. GitHubで公開先のリポジトリを作成します。無料プランのPagesでは公開リポジトリを利用します。PagesのURLから教材は誰でも閲覧できます。
2. **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。
3. このリポジトリのコードをmainへpushします。`.github/workflows/pages.yml` が検証・静的ビルド・公開を実行します。
4. Actionsの「Publish study app to GitHub Pages」が成功したら、表示されたPages URLをiPhone Safariで開きます。

リポジトリ名が `chinese-study` ならURLは `https://<ユーザー名>.github.io/chinese-study/`。`<ユーザー名>.github.io` リポジトリの場合はルートURLに対応します。Actionsがリポジトリ名に応じたBASE_PATHを自動設定するため、リンクやCSSが別パスへ飛びません。

手元でPages用の出力を検証する場合：

```sh
BASE_PATH=/chinese-study pnpm build
BASE_PATH=/chinese-study pnpm test:static
```

通常のローカル開発は `pnpm dev`、ルートの静的出力は `pnpm build` のままです。公開するのはbuild/のHTML・CSS・JavaScript・教材データです。教科書写真・元HTMLは.gitignoreで除外され、ローカルsource/に保持します。GitHubにアップロードする際にこれらを強制追加しないでください。原資料が必要な教材編集はローカルで行います。

`pnpm test:static` は全課のHTML、全項目・クイズ、BASE_PATH配下のリンクとassets、JS不要の表示コントロール、原本画像が出力に含まれないことを検証します。
