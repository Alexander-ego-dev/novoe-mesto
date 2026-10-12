import type {Category, PersonRating, Place} from '../types';
export function personalRating(category:Category,r?:PersonRating):number|undefined {
 if (!r) return undefined;
 if(category!=='cafe') return r.emotions;
 const values=[r.food,r.atmosphere,r.interior];
 return values.every(v=>v!==undefined) ? (values as number[]).reduce((a,b)=>a+b,0)/3 : undefined;
}
export function mean(values:(number|undefined)[]) { const actual=values.filter((v):v is number=>v!==undefined); return actual.length ? actual.reduce((a,b)=>a+b,0)/actual.length : undefined; }
export function rating(p:Place) {return mean([personalRating(p.category,p.husbandRating),personalRating(p.category,p.wifeRating)]);}
export function ratedCount(p:Place) {return [personalRating(p.category,p.husbandRating),personalRating(p.category,p.wifeRating)].filter(v=>v!==undefined).length;}
export function formatRating(n:number|undefined) {return n===undefined?'Пока без оценки':n.toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1});}
export function today(now=new Date()) { return String(now.getFullYear())+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'); }
export function validDate(value:string) {if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false; const [y,m,d]=value.split('-').map(Number); const date=new Date(y,m-1,d); return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d;}
export function visitDate(value:string) {return validDate(value)&&value<=today();}
export function displayDate(value:string) {const [y,m,d]=value.slice(0,10).split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});}
export function safeUrl(value:string) {if(!value)return true;try {const u=new URL(value);return ['http:','https:'].includes(u.protocol);}catch{return false;}}
export function mapUrl(value:string) {try{return /(^|\.)(maps\.google\.[a-z.]+|google\.[a-z.]+|maps\.app\.goo\.gl|yandex\.[a-z.]+|2gis\.[a-z.]+|go\.2gis\.com|goo\.gl)$/.test(new URL(value).hostname);}catch{return false;}}
export function sortPlaces(places:Place[],sort:string) {return [...places].sort((a,b)=>{if(sort==='high'||sort==='low'){const x=rating(a),y=rating(b);if(x===undefined)return y===undefined?0:1;if(y===undefined)return -1;return sort==='high'?y-x:x-y;} const x=a.visitedAt||a.createdAt,y=b.visitedAt||b.createdAt;return sort==='old'?x.localeCompare(y):y.localeCompare(x);});}
export function randomPlace(places:Place[],previous?:string) {const pool=places.length>1?places.filter(p=>p.id!==previous):places;return pool[Math.floor(Math.random()*pool.length)];}
