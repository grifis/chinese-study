# 新しい課を追加する手順

1. `content/lessons/lesson-N/source/` に原HTML・画像等を未修正で保存する。提供されていない本文を記憶で生成しない。
2. source/inventory.md を作り、原番号・話者・見出し・例文数・候補数・練習小問数を原本から記録する。教材配列を数えて期待値を作らない。
3. lesson.json を作る。schemaVersionは1、idはlesson-N、numberはN。7つのsectionsキーはすべて必須。practiceGroupsには大問番号・原文見出し・日本語の指示・所属小問IDを原本順に記録する。大問の指示を先に表示し、その下に小問を（1）（2）と並べる。掲載がない区分は空配列とし、照合表にも0の理由を記録する。
4. grammarGroupsには原本の文法番号・見出し・教科書項目ID・AI補足項目ID・初心者向け説明を記録し、関連表現はgrammarSupplementIdsに記録する。「番号と見出し→教科書の説明・全例文→AIのやさしい補足」の順に表示する。教科書の説明と例文を転記し、拼音・訳・補足を追加する。AI例文、指定候補から作成した完成文、模範解答を明示する。不明な原文はnullの要確認項目にする。
5. review.json を作り、原本から得た期待件数、候補数、各項目の原文・例文数（expectedSentenceCounts）と解答数（expectedAnswerCounts）、文法の原文／補足数、練習群ごとの小問数を記録する。既存課の期待値をそのまま使わない。
6. quiz.json をAI補足として作る。クイズが不要な場合も空配列のファイルを作る。原本の練習を移して削除してはならない。
7. `pnpm validate`、`pnpm check`、`pnpm test`、`pnpm build` を実行する。新しい課のJSONはglobで自動登録され、一覧と全画面に反映される。routesへの追加は不要。
8. 原本と画面の中国語、全文拼音、訳、例文、発話末尾、小問、候補を目視で照合する。iPhone縦画面、表示切り替え、JS無効の基本閲覧も確認する。
9. quality-checklist.mdを確認し、未確認点・音声欠落・校閲待ちを issues に残す。根拠なくreview.statusをverifiedに変えない。

第26課は提供HTMLから8基本文・19発話・23単語・3置換セット・2広げる・7補足文法・10クイズを移行し、画像から教科書文法6項目と全練習を整備した実例。source/inventory.mdの数え方を参照する。
