<script lang="ts">
 import {base} from '$app/paths';let {data}=$props();</script>
<svelte:head><title>ことばのノート · 中国語学習</title><meta name="description" content="漢語会話301句の予習・復習ノート。短い時間で、一課ずつ。"/></svelte:head>
<section class="hero"><p class="eyebrow">YOUR DAILY CHINESE</p><h1>今日も、ひとつ<br/>中国語を自分のことばに。</h1><p>電車の中の5分から。<br/>読んで、確かめて、少しずつ覚える。</p><div class="hero-character" aria-hidden="true">祝</div></section>
<div class="section-top"><h2>学習する課</h2><span>{data.lessons.length} LESSON</span></div>
{#each data.lessons as lesson}<a class="lesson-card" href={`${base}/lessons/${lesson.id}`}><span class="lesson-number">{String(lesson.number).padStart(2,'0')}</span><div><p class="eyebrow">第{lesson.number}課</p><h2 lang="zh-Hans">{lesson.title}</h2><p>{lesson.subtitle}</p><span class="metadata">基本文 {lesson.counts.text} · 単語 {lesson.counts.vocabulary} · 練習 {lesson.counts.practice}項目</span></div><span aria-hidden="true">↗</span></a>{/each}
<p class="quiet">教材はローカルのJSONで管理しています。学習補足には校閲待ちの内容が含まれます。</p>
