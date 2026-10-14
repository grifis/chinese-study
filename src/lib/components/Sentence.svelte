<script lang="ts">
 import type {Sentence} from '$lib/schemas/lesson';
 let {sentence,showPinyin=true,showJapanese=true}: {sentence:Sentence;showPinyin?:boolean;showJapanese?:boolean}=$props();
</script>
{#if sentence.status==='needs-review'}
 <p class="notice">原文要確認 · {sentence.sourceRef}（{sentence.issueId}）</p>
{:else}
 <div class="sentence">
  <p class="zh" lang="zh-Hans">{sentence.zh}</p>
  {#if showPinyin}<p class="pinyin">{sentence.pinyin}</p>{/if}
  {#if showJapanese}<p class="translation">{sentence.ja}</p>{/if}
  <p class="provenance">{sentence.origin==='textbook'?'教科書原文':'AI作成・学習補足'} · {sentence.sourceRef}{sentence.origin==='textbook'?' / 拼音・訳は学習補足':''}</p>
 </div>
{/if}
