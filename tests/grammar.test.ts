import {it,expect} from 'vitest';
import {render} from 'svelte/server';
import Grammar from '../src/lib/components/Grammar.svelte';
import {catalog} from '../src/lib/lessons/catalog';
import {lessonSchema} from '../src/lib/schemas/lesson';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const {lesson} of catalog){
 it(`${lesson.id}: 文法番号→教科書説明→全例文→AI補足の順にSSRで読める`,()=>{
  const {body}=render(Grammar,{props:{lesson}});
  const shown=[...body.matchAll(/data-item-id="([^"]+)"/g)].map(m=>m[1]);
  expect(shown).toHaveLength(lesson.sections.grammar.length);
  expect([...shown].sort()).toEqual(lesson.sections.grammar.map(i=>i.id).sort());
  for(const group of lesson.grammarGroups){
   const start=body.indexOf(`id="grammar-group-${group.number}"`);
   const next=body.indexOf('<section',start+1);const html=body.slice(start,next===-1?undefined:next);
   expect(html).toContain(`${group.number}. ${escape(group.title)}`);
   const helpStart=html.indexOf('class="grammar-help"');
   expect(html.indexOf('教科書の説明・例文')).toBeLessThan(helpStart);
   expect(html).toContain('AIによる学習補足');
   for(const id of group.itemIds){
    const entry=lesson.sections.grammar.find(i=>i.id===id)!;
    expect(html.indexOf(escape(entry.textbookExplanation!))).toBeLessThan(helpStart);
    expect(html).toContain(escape(entry.textbookJapanese!));
    for(const sentence of entry.sentences)if(sentence.status!=='needs-review'){
     expect(html.indexOf(escape(entry.textbookExplanation!))).toBeLessThan(html.indexOf(escape(sentence.zh)));
     expect(html.indexOf(escape(sentence.zh))).toBeLessThan(helpStart);
     expect(html).toContain(escape(sentence.pinyin));expect(html).toContain(escape(sentence.ja));
    }
   }
   for(const paragraph of group.explanation)expect(html.indexOf(escape(paragraph))).toBeGreaterThan(helpStart);
  }
  for(const entry of lesson.sections.grammar.filter(i=>i.supplementText)){
   expect(body).toContain(`<p class="grammar-support-copy">${escape(entry.supplementText!)}</p>`);
   expect(body).toContain(escape(entry.notes));
  }
  expect(body).not.toMatch(/既存HTML|提供HTML|source\/|移行した|つまずきやすいポイントを表示/);
 });
 it('文法のグループで欠落・重複・不明IDを拒否する',()=>{
  for(const change of ['missing','duplicate','unknown']){
   const raw=structuredClone(lesson);
   if(change==='missing')raw.grammarGroups[0].itemIds.pop();
   else if(change==='duplicate')raw.grammarGroups[1].itemIds.push(raw.grammarGroups[0].itemIds[0]);
   else raw.grammarGroups[0].itemIds[0]='not-found';
   expect(lessonSchema.safeParse(raw).success).toBe(false);
  }
 });
 it('教科書の説明をAI補足の区画に移せない',()=>{
  const raw=structuredClone(lesson);const group=raw.grammarGroups[1];
  const id=group.itemIds.shift()!;group.supplementIds.push(id);
  expect(lessonSchema.safeParse(raw).success).toBe(false);
 });
}
