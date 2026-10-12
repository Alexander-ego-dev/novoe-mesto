import Dexie,{type Table} from 'dexie';
import type {Place,Settings,Backup} from '../types';
import {backupSchema,placeSchema,settingsSchema} from '../utils/validation';
class Database extends Dexie {
 places!:Table<Place,string>;
 settings!:Table<Settings&{id:string},string>;
 constructor(){super('novoe-mesto');this.version(1).stores({places:'id,status,category,createdAt,visitedAt',settings:'id'});}
}
export const db=new Database();
export async function savePlace(place:Place){await db.places.put(placeSchema.parse(place));}
export async function saveSettings(settings:Settings){await db.settings.put({...settingsSchema.parse(settings),id:'people'});}
export async function restoreBackup(input:unknown){const backup=backupSchema.parse(input);await db.transaction('rw',db.places,db.settings,async()=>{await db.places.clear();await db.settings.clear();await db.places.bulkPut(backup.places);await saveSettings(backup.settings);});}
export async function exportBackup(settings:Settings):Promise<Backup>{return db.transaction('r',db.places,async()=>({version:1,exportedAt:new Date().toISOString(),places:await db.places.toArray(),settings}));}
