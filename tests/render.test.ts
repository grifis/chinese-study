import {describe,it,expect} from 'vitest';
import {render} from 'svelte/server';
import StudyItems from '../src/lib/components/StudyItems.svelte';
import Quiz from '../src/lib/components/Quiz.svelte';
import {catalog} from '../src/lib/lessons/catalog';
import {sectionKeys} from '../src/lib/schemas/lesson';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
describe('JavaScriptなしの教材表示',()=>{
 for(const {lesson,quiz} of catalog){
  it.each(sectionKeys)(`${lesson.id} / %s 全項目・全候補・全解答をSSRする`,key=>{
   const items=lesson.sections[key];const {body}=render(StudyItems,{props:{items}});
   for(const item of items){
    expect(body).toContain(`data-item-id="${item.id}"`);
    for(const s of [...item.sentences,...item.completed??[],...item.exercise?.answers??[]]) if(s.status!=='needs-review') {expect(body).toContain(escape(s.zh));expect(body).toContain(escape(s.pinyin));expect(body).toContain(escape(s.ja));}
    for(const c of item.candidates??[]) expect(body).toContain(escape(c.zh));
    if(item.textbookExplanation) expect(body).toContain(escape(item.textbookExplanation));
    if(item.exercise){expect(body).toContain(escape(item.exercise.grammar));expect(body).toContain(escape(item.exercise.reason));for(const token of item.exercise.tokens)expect(body).toContain(escape(token.ja));}
   }
  });
  it('クイズの全問・選択肢・正解をSSRする',()=>{const{body}=render(Quiz,{props:{questions:quiz}});for(const q of quiz){expect(body).toContain(`data-quiz-id="${q.id}"`);expect(body).toContain(escape(q.prompt));for(const o of q.options) expect(body).toContain(escape(o));expect(body).toContain(escape(q.explanation));if(q.answerSentence.status!=='needs-review'){expect(body).toContain(escape(q.answerSentence.pinyin));expect(body).toContain(escape(q.answerSentence.ja));}}});
  it('表示切り替えで中国語は残る',()=>{const{body}=render(StudyItems,{props:{items:lesson.sections.text,showPinyin:false,showJapanese:false}});for(const s of lesson.sections.text.flatMap(i=>i.sentences))if(s.status!=='needs-review'){expect(body).toContain(escape(s.zh));expect(body).not.toContain(escape(s.pinyin));expect(body).not.toContain(escape(s.ja));}});
 }
});
