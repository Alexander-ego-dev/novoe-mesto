export const categories = {cafe:'Кафе и рестораны',cinema:'Кино',sport:'Спорт',creative:'Творчество',walking:'Прогулки',entertainment:'Развлечения',culture:'Культура',travel:'Путешествия',other:'Другое'} as const;
export type Category = keyof typeof categories;
export interface PersonRating { food?:number; atmosphere?:number; interior?:number; emotions?:number; comment?:string }
export interface Place { id:string; title:string; category:Category; url:string; note:string; status:'planned'|'visited'; createdAt:string; visitedAt?:string; husbandRating?:PersonRating; wifeRating?:PersonRating }
export interface Settings { husbandName:string; wifeName:string }
export interface Backup { version:1; exportedAt:string; places:Place[]; settings:Settings }
export const defaults:Settings = {husbandName:'Он',wifeName:'Она'};
