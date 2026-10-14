import {error} from '@sveltejs/kit';
import {catalog,findLesson} from '$lib/lessons/catalog';
export function load({params}:{params:{slug:string}}){const bundle=findLesson(params.slug);if(!bundle) error(404,'課が見つかりません');return bundle;}

export function entries(){return catalog.map(({lesson})=>({slug:lesson.id}));}
