import {error} from '@sveltejs/kit';
import {catalog,findLesson} from '$lib/lessons/catalog';
import {sectionKeys,type SectionKey} from '$lib/schemas/lesson';
export function entries(){return catalog.flatMap(({lesson})=>[...sectionKeys,'quiz'].map(section=>({slug:lesson.id,section})));}
export function load({params}:{params:{slug:string;section:string}}) {
 const bundle=findLesson(params.slug);if(!bundle) error(404,'課が見つかりません');
 if(params.section!=='quiz'&&!sectionKeys.includes(params.section as SectionKey)) error(404,'項目が見つかりません');
 return {...bundle,section:params.section as SectionKey|'quiz'};
}
