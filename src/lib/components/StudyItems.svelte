<script lang="ts">
 import Sentence from './Sentence.svelte';
 import type {Item} from '$lib/schemas/lesson';
 let {items,showPinyin=true,showJapanese=true}:{items:Item[];showPinyin?:boolean;showJapanese?:boolean}=$props();
</script>
{#each items as item (item.id)}
 <article class="card" id={item.id} data-item-id={item.id}>
  <p class="eyebrow">{item.title}{item.wordClass ? ` · ${item.wordClass}` : ''}</p>
  {#each item.sentences as sentence}<Sentence {sentence} {showPinyin} {showJapanese}/>{/each}
  {#if item.textbookExplanation}
   <h2 class="small-heading">教科書の説明 · {item.sourceRef}</h2>
   <p class="original" lang="zh-Hans">{item.textbookExplanation}</p>
   {#if showJapanese}<p class="original translation">{item.textbookJapanese}</p>{/if}
  {/if}
  {#if item.candidates}
   <h2 class="small-heading">掲載されている候補 · {item.candidates.length}件</h2>
   <div class="candidate-grid">{#each item.candidates as c}<div class="candidate"><p lang="zh-Hans">{c.zh}</p>{#if showPinyin}<p class="pinyin">{c.pinyin}</p>{/if}</div>{/each}</div>
   <h2 class="small-heading">置き換え後の完成文</h2>
   {#each item.completed??[] as sentence}<Sentence {sentence} {showPinyin} {showJapanese}/>{/each}
  {/if}
  {#if item.notes && !item.exercise}<details><summary>補足説明を読む</summary><p>{item.notes}</p><p class="provenance">AIによる初心者向け補足</p></details>{/if}
  {#if item.supplementText}<details><summary>既存HTMLの学習補足を読む</summary><p class="original">{item.supplementText}</p><p class="provenance">AI補足。原文はsource/のHTMLに保存。</p></details>{/if}
  {#if item.exercise}
   <p class="instruction">{item.notes}</p>
   <details><summary>模範解答・解説を開く</summary>
    <p class="badge">AI作成の解答例 · 別解も可能</p>
    {#each item.exercise.answers as sentence}<Sentence {sentence} {showPinyin} {showJapanese}/>{/each}
    <h2 class="small-heading">単語・表現の分解</h2>
    <dl class="tokens">{#each item.exercise.tokens as token}<div><dt lang="zh-Hans">{token.zh}</dt><dd>{#if showPinyin}<span class="pinyin">{token.pinyin}</span>{/if}{#if showJapanese}<span class="translation">{token.ja}</span>{/if}</dd></div>{/each}</dl>
    <h2 class="small-heading">文法</h2><p>{item.exercise.grammar}</p>
    <h2 class="small-heading">正解の理由</h2><p>{item.exercise.reason}</p>
   </details>
  {/if}
 </article>
{/each}
