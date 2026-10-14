<script lang="ts">
 import {base} from '$app/paths';
 import {sectionKeys,sectionLabels} from '$lib/schemas/lesson';import StudyItems from '$lib/components/StudyItems.svelte';import Quiz from '$lib/components/Quiz.svelte';let {data}=$props();
 const label=$derived(data.section==='quiz'?'復習クイズ':sectionLabels[data.section]);
</script>
<svelte:head><title>{label} · 第{data.lesson.number}課</title></svelte:head>
<a class="breadcrumb" href={`${base}/lessons/${data.lesson.id}`}>← 第{data.lesson.number}課 {data.lesson.title}</a>
<div class="study-heading"><p class="eyebrow">LESSON {data.lesson.number}</p><h1>{label}</h1><p>{data.section==='quiz'?`${data.quiz.length}問で振り返る`:`${data.lesson.sections[data.section].length}項目 · 自分のペースで読む`}</p></div>
<nav class="section-nav" aria-label="学習項目">{#each [...sectionKeys,'quiz'] as key}<a href={`${base}/lessons/${data.lesson.id}/${key}`} aria-current={data.section===key?'page':undefined}>{key==='quiz'?'クイズ':sectionLabels[key as keyof typeof sectionLabels]}</a>{/each}</nav>
<div class="study-reader">
 <div class="display-controls" role="group" aria-label="教材の表示">
  <span>表示</span>
  <label><input id="pinyin-toggle" type="checkbox" checked/>拼音</label>
  <label><input id="japanese-toggle" type="checkbox" checked/>日本語訳</label>
 </div>
 <div class="study-content">

 {#if data.section==='quiz'}<Quiz questions={data.quiz}/>{:else}
 {#if data.section==='replacements'||data.section==='expansion'}<p class="quiet">音読と意味の確認用です。答えを考える問題ではありません。</p>{/if}
 <StudyItems items={data.lesson.sections[data.section]}/>
{/if}
 </div>
</div>
<a class="end-link" href={`${base}/lessons/${data.lesson.id}`}>学習メニューへ戻る →</a>
