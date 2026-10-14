import {catalog} from '../src/lib/lessons/catalog';
for(const {lesson,review} of catalog) console.log(`${lesson.id}: データ・件数・候補数 OK / ${review.status}`);
