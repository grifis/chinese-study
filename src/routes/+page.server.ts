import {catalog} from '$lib/lessons/catalog';
export function load(){return {lessons:catalog.map(({lesson,review})=>({id:lesson.id,number:lesson.number,title:lesson.title,subtitle:lesson.subtitle,counts:review.expectedCounts,status:review.status}))};}
