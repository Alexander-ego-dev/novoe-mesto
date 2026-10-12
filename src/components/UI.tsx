import {useEffect,useRef,type ReactNode} from 'react';
import {X,Coffee,Clapperboard,Dumbbell,Palette,Footprints,Sparkles,Landmark,Compass,MapPin} from 'lucide-react';
import type {Category} from '../types';
export const categoryIcons={cafe:Coffee,cinema:Clapperboard,sport:Dumbbell,creative:Palette,walking:Footprints,entertainment:Sparkles,culture:Landmark,travel:Compass,other:MapPin};
export function CategoryIcon({category,size=22}:{category:Category;size?:number}){const Icon=categoryIcons[category];return <Icon size={size} strokeWidth={1.5} aria-hidden/>;}
export function Sheet({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current!;const old=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();return()=>{dialog.close();document.body.style.overflow=old;};},[]);
 return <dialog ref={ref} className="sheet" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="sheet-inner"><header className="sheet-head"><h2>{title}</h2><button className="icon-button" aria-label="Закрыть" onClick={onClose}><X/></button></header>{children}</div></dialog>;
}
