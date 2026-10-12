import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), '');
 const base = env.VITE_BASE_PATH || '/';
 if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('VITE_BASE_PATH должен начинаться и заканчиваться /');
 return { base, build:{rollupOptions:{output:{manualChunks:{motion:['motion/react'],storage:['dexie','dexie-react-hooks'],validation:['zod']}}}}, plugins: [react(), tailwind(), VitePWA({
 registerType: 'prompt', includeAssets: ['icons/*.png','icons/*.svg'],
 manifest: { name:'Новое место', short_name:'Новое место', description:'Коллекция мест и совместных впечатлений', lang:'ru', theme_color:'#C4DAE8', background_color:'#C4DAE8', display:'standalone', start_url:base, scope:base, id:base,
 icons:[{src:'icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'icons/icon-512.png',sizes:'512x512',type:'image/png'},{src:'icons/maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},
 workbox:{globPatterns:['**/*.{js,css,html,png,svg,woff,woff2}'],navigateFallback:base+'index.html'}
 })] };
});

