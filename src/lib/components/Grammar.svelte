<script lang="ts">
 import Sentence from './Sentence.svelte';
 import StudyItems from './StudyItems.svelte';
 import type {Lesson} from '$lib/schemas/lesson';
 let {lesson}: {lesson:Lesson}=$props();
 const item=(id:string)=>lesson.sections.grammar.find(entry=>entry.id===id)!;
</script>
<nav class="practice-nav" aria-label="文法の項目">
 {#each lesson.grammarGroups as group}<a href={`#grammar-group-${group.number}`}>文法 {group.number}</a>{/each}
 {#if lesson.grammarSupplementIds.length}<a href="#grammar-related">関連表現</a>{/if}
</nav>
{#each lesson.grammarGroups as group}
 <section class="grammar-group" id={`grammar-group-${group.number}`} aria-labelledby={`grammar-heading-${group.number}`}>
  <header class="practice-group-heading"><h2 id={`grammar-heading-${group.number}`} lang="zh-Hans">{group.number}. {group.title}</h2></header>
  <div class="grammar-textbook">
   <h3 class="grammar-block-title">教科書の説明・例文</h3>
   {#each group.itemIds as id}
    {@const entry=item(id)}
    <article class="card grammar-source" id={entry.id} data-item-id={entry.id}>
     {#if group.itemIds.length>1}<h4 class="grammar-part-title">{entry.title}</h4>{/if}
     <p class="provenance">教科書原文 · {entry.sourceRef}</p>
     <p class="original" lang="zh-Hans">{entry.textbookExplanation}</p>
     <p class="original translation">{entry.textbookJapanese}</p>
     {#if entry.sentences.length}<h4 class="grammar-part-title">教科書の例文</h4>{/if}
     {#each entry.sentences as sentence}<Sentence {sentence}/>{/each}
    </article>
   {/each}
  </div>
  <div class="grammar-help">
   <h3 class="grammar-block-title">やさしい補足説明 <span class="badge">AIによる学習補足</span></h3>
   {#each group.explanation as paragraph}<p class="grammar-help-paragraph">{paragraph}</p>{/each}
   <details class="grammar-example-notes"><summary>教科書の例文を読むときのポイント</summary>
    {#each group.itemIds as id}{@const entry=item(id)}<p><b>{entry.title}</b><br/>{entry.notes}</p>{/each}
   </details>
   <StudyItems items={group.supplementIds.map(item)} grammarSupplement/>
  </div>
 </section>
{/each}
{#if lesson.grammarSupplementIds.length}
 <section class="grammar-group grammar-related" id="grammar-related" aria-labelledby="grammar-related-title">
  <h2 id="grammar-related-title">関連表現の補足</h2>
  <p class="grammar-related-intro">ここからはAIによる学習補足です。教科書の文法1〜{lesson.grammarGroups.length}とは分けて確認できます。</p>
  <StudyItems items={lesson.grammarSupplementIds.map(item)} grammarSupplement/>
 </section>
{/if}
