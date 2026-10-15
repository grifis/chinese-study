import { z } from 'zod';
const nonempty = z.string().trim().min(1);
const annotation = { sourceRef: nonempty, annotationOrigin: z.literal('ai'), annotationStatus: z.literal('needs-review') };
export const sentenceSchema = z.discriminatedUnion('status', [
  z.object({ zh: nonempty, pinyin: nonempty, ja: nonempty, origin: z.literal('textbook'), status: z.literal('verified'), ...annotation }).strict(),
  z.object({ zh: nonempty, pinyin: nonempty, ja: nonempty, origin: z.literal('ai'), status: z.literal('supplement'), ...annotation }).strict(),
  z.object({ zh: z.null(), pinyin: z.null(), ja: z.null(), origin: z.literal('textbook'), status: z.literal('needs-review'), issueId: nonempty, sourceRef: nonempty }).strict()
]);
const token = z.object({zh: nonempty, pinyin: nonempty, ja: nonempty}).strict();
export const itemSchema = z.object({
  id: nonempty, title: nonempty, sentences: z.array(sentenceSchema), notes: z.string(),
  sourceRef: nonempty.optional(), textbookExplanation: nonempty.optional(), textbookJapanese: nonempty.optional(),
  supplementText: nonempty.optional(), wordClass: nonempty.optional(), meaningOrigin: z.literal('textbook').optional(),
  candidates: z.array(z.object({zh: nonempty, pinyin: nonempty}).strict()).optional(),
  completed: z.array(sentenceSchema).optional(),
  exercise: z.object({answers: z.array(sentenceSchema).min(1), tokens: z.array(token).min(1), grammar: nonempty, reason: nonempty, answerOrigin: z.literal('ai')}).strict().optional()
}).strict();
export const sectionKeys = ['text','dialogue','grammar','vocabulary','replacements','expansion','practice'] as const;
export type SectionKey = typeof sectionKeys[number];
export const sectionLabels: Record<SectionKey, string> = {text:'本文・基本文',dialogue:'会話',grammar:'文法',vocabulary:'単語',replacements:'置き換え',expansion:'広げる',practice:'練習・解答解説'};
export const lessonSchema = z.object({
  schemaVersion: z.literal(1), id: z.string().regex(/^lesson-\d+$/), number: z.number().int().positive(), title: nonempty, subtitle: nonempty, book: nonempty,
  practiceGroups: z.array(z.object({number:z.number().int().positive(),title:nonempty,instruction:nonempty,itemIds:z.array(nonempty).min(1)}).strict()),
  sources: z.array(z.object({file:nonempty,description:nonempty}).strict()).min(1),
  issues: z.array(z.object({id:nonempty,location:nonempty,message:nonempty,status:z.literal('needs-review')}).strict()),
  sections: z.object(Object.fromEntries(sectionKeys.map(k=>[k,z.array(itemSchema)])) as Record<SectionKey,z.ZodArray<typeof itemSchema>>).strict()
}).strict().superRefine((lesson,ctx)=>{
  const groupedIds=lesson.practiceGroups.flatMap(group=>group.itemIds);
  const practiceIds=lesson.sections.practice.map(item=>item.id);
  if(JSON.stringify(groupedIds)!==JSON.stringify(practiceIds)) ctx.addIssue({code:'custom',message:'練習の大問に小問の欠落・重複・順序不整合があります'});
  if(new Set(lesson.practiceGroups.map(group=>group.number)).size!==lesson.practiceGroups.length) ctx.addIssue({code:'custom',message:'練習の大問番号が重複しています'});
  for(const group of lesson.practiceGroups) for(const id of group.itemIds) if(id!==`practice-${group.number}`&&!id.startsWith(`practice-${group.number}-`)) ctx.addIssue({code:'custom',message:`大問と小問の番号が一致しません: ${id}`});
  const ids = new Set<string>();
  for (const key of sectionKeys) for (const item of lesson.sections[key]) {
    if(ids.has(item.id)) ctx.addIssue({code:'custom',message:`ID重複: ${item.id}`});
    ids.add(item.id);
    if(key==='replacements' && (!item.candidates?.length || item.completed?.length!==item.candidates.length || item.sentences.length!==1)) ctx.addIssue({code:'custom',message:`置き換えの元文・候補・完成文が不整合: ${item.id}`});
    if(key==='practice' && !item.exercise) ctx.addIssue({code:'custom',message:`解答解説がありません: ${item.id}`});
    if(!item.sentences.length && !item.textbookExplanation && !item.supplementText) ctx.addIssue({code:'custom',message:`内容がありません: ${item.id}`});
    for(const sentence of [...item.sentences,...item.completed??[],...item.exercise?.answers??[]]) {
      if(sentence.status==='needs-review' && !lesson.issues.some(i=>i.id===sentence.issueId)) ctx.addIssue({code:'custom',message:`要確認の記録がありません: ${item.id}`});
    }
  }
});
export const reviewSchema=z.object({lessonId:nonempty,status:z.enum(['needs-review','verified']),expectedCounts:z.object(Object.fromEntries(sectionKeys.map(k=>[k,z.number().int().nonnegative()])) as Record<SectionKey,z.ZodNumber>).strict(),expectedSentenceCounts:z.record(nonempty,z.number().int().nonnegative()),expectedAnswerCounts:z.record(nonempty,z.number().int().positive()),replacementCandidateCounts:z.record(nonempty,z.number().int().positive()),textbookGrammarCount:z.number().int().nonnegative(),supplementGrammarCount:z.number().int().nonnegative(),exerciseGroups:z.record(nonempty,z.number().int().nonnegative()),corrections:z.array(z.object({location:nonempty,before:nonempty,after:nonempty,evidence:nonempty}).strict()),inventoryNotes:nonempty}).strict();
export const quizSchema=z.array(z.object({id:nonempty,prompt:nonempty,options:z.array(nonempty).min(2),correctIndex:z.number().int().nonnegative(),explanation:nonempty,origin:z.literal('ai'),answerSentence:sentenceSchema}).strict().refine(q=>q.correctIndex<q.options.length,'正解の番号が範囲外です'));
export type Lesson=z.infer<typeof lessonSchema>;
export type Item=z.infer<typeof itemSchema>;
export type Sentence=z.infer<typeof sentenceSchema>;
export type Review=z.infer<typeof reviewSchema>;
export type Quiz=z.infer<typeof quizSchema>;
export function validateBundle(rawLesson:unknown,rawReview:unknown,rawQuiz:unknown) {
  const lesson=lessonSchema.parse(rawLesson), review=reviewSchema.parse(rawReview), quiz=quizSchema.parse(rawQuiz);
  if(review.lessonId!==lesson.id || lesson.id!==`lesson-${lesson.number}`) throw new Error('課IDが一致しません');
  for(const key of sectionKeys) if(lesson.sections[key].length!==review.expectedCounts[key]) throw new Error(`掲載数不一致: ${key}`);
  const allItems=Object.values(lesson.sections).flat();
  if(Object.keys(review.expectedSentenceCounts).length!==allItems.length) throw new Error('原文・例文の照合記録が不足しています');
  for(const item of allItems) if(item.sentences.length!==review.expectedSentenceCounts[item.id]) throw new Error(`原文・例文の欠落: ${item.id}`);
  if(Object.keys(review.expectedAnswerCounts).length!==lesson.sections.practice.length) throw new Error('解答数の照合記録が不足しています');
  for(const item of lesson.sections.practice) if(item.exercise?.answers.length!==review.expectedAnswerCounts[item.id]) throw new Error(`解答例の欠落: ${item.id}`);
  const replacements=lesson.sections.replacements;
  if(Object.keys(review.replacementCandidateCounts).length!==replacements.length) throw new Error('候補数の原本照合が不足しています');
  for(const item of replacements) if(item.candidates?.length!==review.replacementCandidateCounts[item.id]) throw new Error(`候補の欠落: ${item.id}`);
  const textbook=lesson.sections.grammar.filter(i=>i.textbookExplanation).length;
  if(textbook!==review.textbookGrammarCount || lesson.sections.grammar.length-textbook!==review.supplementGrammarCount) throw new Error('文法の原文・補足数が不一致');
  for(const [group,count] of Object.entries(review.exerciseGroups)) if(lesson.sections.practice.filter(i=>i.id===`practice-${group}` || i.id.startsWith(`practice-${group}-`)).length!==count) throw new Error(`練習${group}の欠落`);
  if(review.status==='verified' && (lesson.issues.length || Object.values(lesson.sections).flat().some(i=>i.sentences.some(s=>s.status==='needs-review')))) throw new Error('要確認を解消せず照合済みにはできません');
  if(new Set(quiz.map(q=>q.id)).size!==quiz.length) throw new Error('クイズID重複');
  return {lesson,review,quiz};
}
