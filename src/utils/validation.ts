import {z} from 'zod';
import {safeUrl,visitDate} from './domain';
const category=z.enum(['cafe','cinema','sport','creative','walking','entertainment','culture','travel','other']);
const score=z.number().int().min(1).max(5).optional();
const person=z.object({food:score,atmosphere:score,interior:score,emotions:score,comment:z.string().max(5000).optional()}).strict();
export const fieldsSchema=z.object({title:z.string().trim().min(1,'Введите название').max(150,'Не больше 150 символов'),category,url:z.string().trim().max(2048).refine(safeUrl,'Укажите ссылку http:// или https://'),note:z.string().max(5000)});
export const settingsSchema=z.object({husbandName:z.string().trim().min(1).max(40),wifeName:z.string().trim().min(1).max(40)}).strict();
export const placeSchema=fieldsSchema.extend({id:z.string().uuid(),status:z.enum(['planned','visited']),createdAt:z.string().datetime({offset:true}),visitedAt:z.string().refine(visitDate,'Дата посещения должна быть реальной и не позже сегодня').optional(),husbandRating:person.optional(),wifeRating:person.optional()}).strict().superRefine((p,ctx)=>{
 if(p.status==='visited'&&!p.visitedAt)ctx.addIssue({code:'custom',message:'Нет даты посещения'});
 if(p.status==='planned'&&(p.visitedAt||p.husbandRating||p.wifeRating))ctx.addIssue({code:'custom',message:'У планов не должно быть данных посещения'});
 for(const r of [p.husbandRating,p.wifeRating])if(r&&(p.category==='cafe'?r.emotions!==undefined:[r.food,r.atmosphere,r.interior].some(v=>v!==undefined)))ctx.addIssue({code:'custom',message:'Оценки несовместимы с категорией'});
});
export const backupSchema=z.object({version:z.literal(1),exportedAt:z.string().datetime({offset:true}),places:z.array(placeSchema).max(50000),settings:settingsSchema}).strict().refine(b=>new Set(b.places.map(p=>p.id)).size===b.places.length,'Повторяющиеся ID');
