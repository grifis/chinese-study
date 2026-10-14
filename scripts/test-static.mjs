import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const base=process.env.BASE_PATH??'';
const read=path=>readFileSync(path,'utf8');
const assertPage=path=>{const file=join('build',path,'index.html');assert(existsSync(file),`静的HTMLがありません: ${file}`);return read(file);};
const home=assertPage('');
for(const slug of readdirSync('content/lessons')){
 const lesson=JSON.parse(read(`content/lessons/${slug}/lesson.json`));
 const quiz=JSON.parse(read(`content/lessons/${slug}/quiz.json`));
 assert(home.includes(`${base}/lessons/${slug}`),'一覧のリンクにbaseがありません');
 assertPage(`lessons/${slug}`);
 for(const [section,items] of Object.entries(lesson.sections)){
  const html=assertPage(`lessons/${slug}/${section}`);
  const ids=[...html.matchAll(/data-item-id="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(ids,items.map(i=>i.id),`${section}の静的出力に欠落があります`);
  assert(html.includes('id="pinyin-toggle"')&&html.includes('id="japanese-toggle"'),'表示切り替えがありません');
  assert(html.includes('class="zh"'),'中国語本文がありません');
 }
 const html=assertPage(`lessons/${slug}/quiz`);
 assert.equal([...html.matchAll(/data-quiz-id=/g)].length,quiz.length);
}
function files(dir){return readdirSync(dir).flatMap(n=>{const p=join(dir,n);return statSync(p).isDirectory()?files(p):[p];});}
const output=files('build');
for(const path of output){
 assert(!/\.(?:jpe?g|png)$/i.test(path),'原本画像は公開しません');
 if(!path.endsWith('.html'))continue;
 const html=read(path);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const link=match[1].split(/[?#]/)[0];
  if(!link.startsWith('/'))continue;
  assert(link===`${base}/`||link.startsWith(`${base}/`),`${path}: baseを外れた参照 ${link}`);
  const target=join('build',decodeURI(link.slice(base.length)));
  assert(existsSync(target),`${path}: リンク先がありません ${link}`);
 }
}
assert(output.some(p=>p.endsWith('.css')&&read(p).includes('pinyin-toggle')),'CSSの表示切り替えがありません');
console.log(`静的公開チェックOK: 全課・全項目・クイズ・baseリンク・表示切り替え / BASE_PATH=${base||'/'}`);
