import {describe,it,expect} from 'vitest';
import {personalRating,rating,mean,validDate,visitDate,today,safeUrl,sortPlaces,randomPlace} from './domain';
import {backupSchema,placeSchema} from './validation';
import type {Place} from '../types';
const p:Place={id:'3b3803f7-564a-4c60-bf82-0d2fc9479e97',title:'Кофейня',category:'cafe',url:'https://yandex.ru/maps/',note:'',status:'visited',createdAt:'2026-01-01T12:00:00.000Z',visitedAt:'2026-01-02'};
describe('Рейтинги',()=>{
 it('не округляет промежуточные результаты',()=>expect(rating({...p,husbandRating:{food:4,atmosphere:5,interior:4},wifeRating:{food:5,atmosphere:4,interior:5}})).toBe(4.5));
 it('не считает частичную тройку',()=>expect(personalRating('cafe',{food:5,atmosphere:4})).toBeUndefined());
 it('полная тройка',()=>expect(personalRating('cafe',{food:4,atmosphere:5,interior:4})).toBeCloseTo(13/3));
 it('один человек',()=>expect(rating({...p,category:'sport',husbandRating:{emotions:5}})).toBe(5));
 it('два человека',()=>expect(rating({...p,category:'sport',husbandRating:{emotions:5},wifeRating:{emotions:4}})).toBe(4.5));
 it('без оценок',()=>expect(rating(p)).toBeUndefined());
 it('среднее только оценённых мест',()=>expect(mean([undefined,4,5])).toBe(4.5));
});
describe('Даты и ссылки',()=>{
 it('проверяет високосный год',()=>{expect(validDate('2024-02-29')).toBe(true);expect(validDate('2025-02-29')).toBe(false);expect(validDate('2026-04-31')).toBe(false);});
 it('будущие даты запрещены',()=>{expect(visitDate('2999-01-01')).toBe(false);expect(visitDate(today())).toBe(true);});
 it('локальная дата',()=>expect(today(new Date(2026,0,2,0,1))).toBe('2026-01-02'));
 it('безопасные протоколы',()=>{for(const s of ['javascript:alert(1)','data:text/html,test','file:///tmp/a','not a url'])expect(safeUrl(s)).toBe(false);expect(safeUrl('https://2gis.ru')).toBe(true);expect(safeUrl('http://example.com')).toBe(true);});
});
describe('Резервные копии',()=>{
 const b={version:1,exportedAt:'2026-01-01T12:00:00.000Z',places:[p],settings:{husbandName:'Он',wifeName:'Она'}};
 it('принимает корректную копию',()=>expect(backupSchema.safeParse(b).success).toBe(true));
 it('отклоняет версию',()=>expect(backupSchema.safeParse({...b,version:2}).success).toBe(false));
 it('отклоняет повтор ID',()=>expect(backupSchema.safeParse({...b,places:[p,p]}).success).toBe(false));
 it('отклоняет небезопасную ссылку',()=>expect(placeSchema.safeParse({...p,url:'javascript:alert(1)'}).success).toBe(false));
 it('проверяет оценки',()=>{for(const emotions of [0,6,1.5,'5'])expect(placeSchema.safeParse({...p,category:'sport',husbandRating:{emotions}}).success).toBe(false);});
 it('отклоняет несовместимые критерии',()=>expect(placeSchema.safeParse({...p,husbandRating:{emotions:5}}).success).toBe(false));
 it('посещение требует дату',()=>expect(placeSchema.safeParse({...p,visitedAt:undefined}).success).toBe(false));
});
describe('Выбор и сортировка',()=>{
 it('без рейтинга в конце в обоих направлениях',()=>{const rated={...p,id:crypto.randomUUID(),husbandRating:{food:5,atmosphere:5,interior:5}};expect(sortPlaces([p,rated],'low')[0]).toBe(rated);expect(sortPlaces([p,rated],'high')[0]).toBe(rated);});
 it('не повторяет предыдущий выбор',()=>{const second={...p,id:crypto.randomUUID()};expect(randomPlace([p,second],p.id)).toBe(second);});
 it('один или ноль вариантов',()=>{expect(randomPlace([p],p.id)).toBe(p);expect(randomPlace([])).toBeUndefined();});
});
