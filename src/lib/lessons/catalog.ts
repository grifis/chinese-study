import { validateBundle } from '../schemas/lesson';
const lessons=import.meta.glob('/content/lessons/*/lesson.json',{eager:true,import:'default'});
const reviews=import.meta.glob('/content/lessons/*/review.json',{eager:true,import:'default'});
const quizzes=import.meta.glob('/content/lessons/*/quiz.json',{eager:true,import:'default'});
export const catalog=Object.entries(lessons).map(([path,raw])=>validateBundle(raw,reviews[path.replace('lesson.json','review.json')],quizzes[path.replace('lesson.json','quiz.json')])).sort((a,b)=>a.lesson.number-b.lesson.number);
export function findLesson(slug:string){return catalog.find(x=>x.lesson.id===slug);}
