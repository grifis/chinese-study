<script lang="ts">
 import Sentence from './Sentence.svelte';
 import type {Quiz} from '$lib/schemas/lesson';
 let {questions,showPinyin=true,showJapanese=true}:{questions:Quiz;showPinyin?:boolean;showJapanese?:boolean}=$props();
 let choices=$state<Record<string,number>>({});
 const score=$derived(questions.filter(q=>choices[q.id]===q.correctIndex).length);
 const answered=$derived(Object.keys(choices).length);
</script>
<p class="notice">既存HTMLから移行したAI作成クイズ。教科書の練習問題とは別の学習補足です。</p>
{#if answered}<p aria-live="polite" class="score">{answered} / {questions.length}問回答 · 正解 {score}問</p><button onclick={()=>choices={}}>回答をリセット</button>{/if}
{#each questions as q,n}
 <article class="card" data-quiz-id={q.id}>
  <p class="eyebrow">CHECK {String(n+1).padStart(2,'0')}</p><h2 class="quiz-prompt">{q.prompt}</h2>
  <fieldset><legend class="sr-only">{q.prompt}</legend>{#each q.options as option,i}<label class="quiz-option"><input type="radio" name={q.id} value={i} checked={choices[q.id]===i} onchange={()=>choices[q.id]=i}/><span>{option}</span></label>{/each}</fieldset>
  {#if choices[q.id]!==undefined}<p aria-live="polite" class="result">{choices[q.id]===q.correctIndex?'正解です':'もう一度、解説を確認しましょう'}</p>{/if}
  <details><summary>正解と解説を読む</summary><p>{q.explanation}</p><Sentence sentence={q.answerSentence} {showPinyin} {showJapanese}/></details>
 </article>
{/each}
<noscript><p class="notice">JavaScriptが無効でも、各問題の「正解と解説を読む」で復習できます。</p></noscript>
