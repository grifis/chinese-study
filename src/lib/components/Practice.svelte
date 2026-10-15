<script lang="ts">
 import StudyItems from './StudyItems.svelte';
 import type {Lesson} from '$lib/schemas/lesson';
 let {lesson}: {lesson:Lesson}=$props();
</script>
<nav class="practice-nav" aria-label="練習の大問">
 {#each lesson.practiceGroups as group}<a href={`#practice-group-${group.number}`}>大問 {group.number}</a>{/each}
</nav>
{#each lesson.practiceGroups as group}
 <section class="practice-group" id={`practice-group-${group.number}`} aria-labelledby={`practice-heading-${group.number}`}>
  <header class="practice-group-heading">
   <h2 id={`practice-heading-${group.number}`} lang="zh-Hans">{group.number}. {group.title}</h2>
   <p>{group.instruction}</p>
  </header>
  <StudyItems items={group.itemIds.map(id=>lesson.sections.practice.find(item=>item.id===id)!)} exerciseGroup/>
 </section>
{/each}
