<script lang="ts">
 import {base} from '$app/paths';
 import {sectionKeys,sectionLabels} from '$lib/schemas/lesson';let {data}=$props();
 const descriptions={text:'基本文を一文ずつ読む',dialogue:'会話の流れを確認する',grammar:'原文の説明＋初心者向け補足',vocabulary:'拼音と意味を確かめる',replacements:'候補をすべて音読する',expansion:'掲載文を読んで理解する',practice:'解答例と理由を確認する'};
</script>
<svelte:head><title>第{data.lesson.number}課 {data.lesson.title} · ことばのノート</title></svelte:head>
<a class="breadcrumb" href={`${base}/`}>← 課の一覧</a>
<section class="lesson-hero"><p class="eyebrow">LESSON {data.lesson.number}</p><h1 lang="zh-Hans">{data.lesson.title}</h1><p>{data.lesson.subtitle}</p><span class="badge">{data.lesson.issues.length ? '確認事項あり · 下の照合記録をご確認ください' : '原文と学習補足を区別して収録'}</span></section>
<div class="section-top"><h2>学習メニュー</h2><span>好きな項目から</span></div>
<div class="menu-grid">{#each sectionKeys as key,n}<a class="menu-card" href={`${base}/lessons/${data.lesson.id}/${key}`}><span class="eyebrow">{String(n+1).padStart(2,'0')} / {key==='grammar'?`${data.lesson.grammarGroups.length}項目＋補足`:`${data.lesson.sections[key].length}項目`}</span><h2>{sectionLabels[key]}</h2><p>{descriptions[key]}</p><span class="menu-arrow" aria-hidden="true">→</span></a>{/each}<a class="menu-card quiz-menu" href={`${base}/lessons/${data.lesson.id}/quiz`}><span class="eyebrow">QUICK REVIEW / {data.quiz.length}問</span><h2>復習クイズ</h2><p>学んだことを試してみる</p><span class="menu-arrow" aria-hidden="true">→</span></a></div>
<details class="audit"><summary>原本との照合記録・要確認箇所</summary><p>{data.review.inventoryNotes}</p>{#each data.lesson.issues as issue}<p class="notice"><b>{issue.location}</b><br/>{issue.message}</p>{/each}<h2 class="small-heading">修正履歴</h2>{#each data.review.corrections as c}<p><b>{c.location}</b><br/>{c.before} → {c.after}<br/><span class="provenance">{c.evidence}</span></p>{/each}<h2 class="small-heading">保存した原資料</h2><ul>{#each data.lesson.sources as source}<li>{source.description} · {source.file}</li>{/each}</ul></details>
