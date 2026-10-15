import {it,expect} from 'vitest';
import {render} from 'svelte/server';
import Practice from '../src/lib/components/Practice.svelte';
import {catalog} from '../src/lib/lessons/catalog';
import {lessonSchema} from '../src/lib/schemas/lesson';
for(const {lesson} of catalog){
 it(`${lesson.id}: 大問の指示が小問より先に一度だけ表示され、全小問を原本順に読める`,()=>{
  const {body}=render(Practice,{props:{lesson}});
  expect([...body.matchAll(/data-item-id="([^"]+)"/g)].map(m=>m[1])).toEqual(lesson.sections.practice.map(i=>i.id));
  for(const group of lesson.practiceGroups){
   const start=body.indexOf(`id="practice-group-${group.number}"`);
   const next=body.indexOf('<section',start+1);
   const html=body.slice(start,next===-1?undefined:next);
   expect(html.split(group.instruction)).toHaveLength(2);
   expect(html.indexOf(group.instruction)).toBeLessThan(html.indexOf('data-item-id='));
   if(group.itemIds.length>1)for(let n=1;n<=group.itemIds.length;n++)expect(html).toContain(`（${n}）`);
  }
 });
 it('完成对话の指示の直後に（1）（2）（3）と全解答を表示する',()=>{
  const{body}=render(Practice,{props:{lesson}});
  const start=body.indexOf('id="practice-group-3"');
  const html=body.slice(start,body.indexOf('id="practice-group-4"'));
  expect(html).toContain('完成对话（用上祝愿、祝贺的话）');
  expect([...html.matchAll(/class="subquestion-number">([^<]+)/g)].map(m=>m[1])).toEqual(['（1）','（2）','（3）']);
  expect([...html.matchAll(/模範解答・解説を開く/g)]).toHaveLength(3);
 });
 it('大問の小問の欠落・重複・順序入れ替えを拒否する',()=>{
  for(const change of ['missing','duplicate','reorder']){
   const raw=structuredClone(lesson);const ids=raw.practiceGroups[2].itemIds;
   if(change==='missing')ids.pop();else if(change==='duplicate')ids.push(ids[0]);else ids.reverse();
   expect(lessonSchema.safeParse(raw).success).toBe(false);
  }
 });
}
