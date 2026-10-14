import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {validateBundle,sectionKeys,sentenceSchema} from '../src/lib/schemas/lesson';
const content=new URL('../content/lessons/',import.meta.url);
const read=(slug:string,file:string)=>JSON.parse(readFileSync(new URL(`${slug}/${file}.json`,content),'utf8'));
const raw=()=>[read('lesson-26','lesson'),read('lesson-26','review'),read('lesson-26','quiz')];
describe('教材品質',()=>{
 it('すべての課を検証する',()=>{for(const slug of readdirSync(content)) expect(()=>validateBundle(read(slug,'lesson'),read(slug,'review'),read(slug,'quiz'))).not.toThrow();});
 it('必須の拼音・日本語訳が欠けた教材を拒否する',()=>{for(const field of ['pinyin','ja']){const [l,r,q]=raw();delete l.sections.text[0].sentences[0][field];expect(()=>validateBundle(l,r,q)).toThrow();}});
 it.each(sectionKeys)('%sの掲載項目が欠落すると失敗する',(key)=>{const [l,r,q]=raw();l.sections[key].pop();expect(()=>validateBundle(l,r,q)).toThrow();});
 it('候補と完成文の両方を削除しても原本数で検出する',()=>{const[l,r,q]=raw();l.sections.replacements[0].candidates.pop();l.sections.replacements[0].completed.pop();expect(()=>validateBundle(l,r,q)).toThrow();});
 it('文法例文・解答例の内部の欠落も検出する',()=>{const[l,r,q]=raw();l.sections.grammar[1].sentences.pop();expect(()=>validateBundle(l,r,q)).toThrow();const[l2,r2,q2]=raw();l2.sections.practice[0].exercise.answers.pop();expect(()=>validateBundle(l2,r2,q2)).toThrow();});
 it('候補に対応する完成文を必須にする',()=>{const[l,r,q]=raw();l.sections.replacements[0].completed.pop();expect(()=>validateBundle(l,r,q)).toThrow();});
 it('原文不明には生成した内容を入れられない',()=>{const unknown={zh:null,pinyin:null,ja:null,origin:'textbook',status:'needs-review',issueId:'blur',sourceRef:'p.1'};expect(sentenceSchema.safeParse(unknown).success).toBe(true);expect(sentenceSchema.safeParse({...unknown,zh:'推測文'}).success).toBe(false);});
 it('要確認の関連記録を必須にする',()=>{const[l,r,q]=raw();l.sections.text[0].sentences[0]={zh:null,pinyin:null,ja:null,origin:'textbook',status:'needs-review',issueId:'missing',sourceRef:'p.52'};expect(()=>validateBundle(l,r,q)).toThrow();});
 it('AIの解答を教科書由来と偽装できない',()=>{const[l,r,q]=raw();l.sections.practice[0].exercise.answers[0].origin='textbook';expect(()=>validateBundle(l,r,q)).toThrow();});
 it('重複ID・不正なクイズ正解番号を拒否する',()=>{const[l,r,q]=raw();l.sections.text[1].id=l.sections.text[0].id;expect(()=>validateBundle(l,r,q)).toThrow();q[0].correctIndex=99;expect(()=>validateBundle(...raw().slice(0,2) as [unknown,unknown],q)).toThrow();});
 it('画像との主要な修正を保持する',()=>{const[l]=raw();expect(l.sections.expansion[0].sentences[0].zh).toContain('发了微信');expect(l.sections.practice.find((i:{id:string})=>i.id==='practice-4-3').sentences[0].zh).toBe('我的手表坏了，……？');expect(l.sections.practice.at(-1).sentences[0].zh).toContain('Xièxie');});
});
