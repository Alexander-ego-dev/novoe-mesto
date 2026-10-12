import {useRef,useState,type FormEvent} from 'react';
import {ArrowUpRight,Check} from 'lucide-react';
import {categories,type Place,type Category} from '../types';
import {fieldsSchema} from '../utils/validation';
import {CategoryIcon} from '../components/UI';
export function PlaceForm({initial,onSave,onCancel}:{initial?:Place;onSave:(data:{title:string;category:Category;url:string;note:string})=>Promise<void>;onCancel?:()=>void}){
 const [title,setTitle]=useState(initial?.title||''),[category,setCategory]=useState<Category|undefined>(initial?.category),[url,setUrl]=useState(initial?.url||''),[note,setNote]=useState(initial?.note||''),[errors,setErrors]=useState<Record<string,string>>({}),[busy,setBusy]=useState(false);const lock=useRef(false);
 async function submit(e:FormEvent){e.preventDefault();if(lock.current)return;const parsed=fieldsSchema.safeParse({title,category,url,note});if(!parsed.success){setErrors(Object.fromEntries(parsed.error.issues.map(i=>[i.path[0],i.message])));return;}lock.current=true;setBusy(true);setErrors({});try{await onSave(parsed.data);if(!initial){setTitle('');setCategory(undefined);setUrl('');setNote('');}}catch{setErrors({save:'Не удалось сохранить. Ваши данные остались в форме. Попробуйте ещё раз.'});}finally{lock.current=false;setBusy(false);}}
 return <form className="place-form" onSubmit={submit} noValidate><label htmlFor="title">Название <span>обязательно</span></label><input id="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Куда хочется сходить?" maxLength={150} aria-invalid={!!errors.title}/>{errors.title&&<p className="error">{errors.title}</p>}
 <fieldset><legend>Категория <span>обязательно</span></legend><div className="category-grid">{(Object.entries(categories) as [Category,string][]).map(([key,label])=><button type="button" key={key} className={'chip '+(category===key?'active':'')} aria-pressed={category===key} onClick={()=>setCategory(key)}><CategoryIcon category={key} size={18}/>{label}{category===key&&<Check size={14}/>}</button>)}</div>{errors.category&&<p className="error">Выберите категорию</p>}</fieldset>
 <label htmlFor="url">Ссылка <span>необязательно</span></label><input id="url" type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="На карты или любимый сайт" maxLength={2048}/>{errors.url&&<p className="error">{errors.url}</p>}
 <label htmlFor="note">Заметка <span>необязательно</span></label><textarea id="note" value={note} onChange={e=>setNote(e.target.value)} placeholder="Почему хочется сюда сходить?" maxLength={5000} rows={3}/>
 {errors.save&&<p className="error" role="alert">{errors.save}</p>}<button className="primary" disabled={busy}>{busy?'Сохраняем…':initial?'Сохранить изменения':'Добавить место'}<ArrowUpRight size={20}/></button>{onCancel&&<button type="button" className="secondary" onClick={onCancel}>Отмена</button>}
 </form>;
}
