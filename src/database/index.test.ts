import 'fake-indexeddb/auto';
import {beforeEach,describe,it,expect} from 'vitest';
import {db,savePlace,restoreBackup,exportBackup,saveSettings} from './index';
import {defaults,type Place} from '../types';
const p:Place={id:'3b3803f7-564a-4c60-bf82-0d2fc9479e97',title:'Кофейня',category:'cafe',url:'',note:'Запомнить',status:'planned',createdAt:'2026-01-01T12:00:00.000Z'};
beforeEach(async()=>{await db.places.clear();await db.settings.clear();});
describe('IndexedDB',()=>{
 it('добавляет и обновляет одну запись',async()=>{await savePlace(p);await savePlace({...p,status:'visited',visitedAt:'2026-01-02',husbandRating:{food:5}});expect(await db.places.count()).toBe(1);expect((await db.places.get(p.id))?.status).toBe('visited');});
 it('сохраняет после повторного открытия',async()=>{await savePlace(p);db.close();await db.open();expect(await db.places.get(p.id)).toEqual(p);});
 it('позволяет добавить вторую оценку позже',async()=>{const v={...p,status:'visited' as const,visitedAt:'2026-01-02',husbandRating:{food:4,atmosphere:5,interior:4}};await savePlace(v);await savePlace({...v,wifeRating:{food:5,atmosphere:4,interior:5}});expect((await db.places.get(p.id))?.wifeRating?.food).toBe(5);});
 it('экспорт и восстановление',async()=>{await savePlace(p);await saveSettings(defaults);const backup=await exportBackup(defaults);await db.places.clear();await restoreBackup(backup);expect(await db.places.get(p.id)).toEqual(p);});
 it('повреждённая копия не изменяет базу',async()=>{await savePlace(p);await expect(restoreBackup({version:2})).rejects.toThrow();expect(await db.places.get(p.id)).toEqual(p);});
 it('транзакция откатывается при сбое записи',async()=>{await savePlace(p);const original=db.settings.put;db.settings.put=(()=>Promise.reject(new Error('storage failure'))) as unknown as typeof original;try{await expect(restoreBackup({version:1,exportedAt:new Date().toISOString(),places:[],settings:defaults})).rejects.toThrow();expect(await db.places.get(p.id)).toEqual(p);}finally{db.settings.put=original;}});
 it('удаляет запись',async()=>{await savePlace(p);await db.places.delete(p.id);expect(await db.places.count()).toBe(0);});
});

