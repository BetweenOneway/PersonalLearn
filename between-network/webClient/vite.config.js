import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(
    {
        plugins: [
            vue(),
            vueDevTools(),
        ],
        resolve: {
            alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
        server:{
            port:18080,//端口号
            proxy:{
                '/note-server':{
                    target:'http://127.0.0.1:18081',
                    changeOrigin:true,//允许跨域
                    rewrite:path=>path.replace(/^\/note-server/,'')
                }
            }
        }
    }
)
