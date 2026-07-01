import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 后端 API 地址：容器内通过 Docker 服务名访问，本地通过 127.0.0.1
const API_TARGET = process.env.VITE_API_TARGET || 'http://127.0.0.1:18081'

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
            // 在容器内需要暴露到 0.0.0.0 才能从宿主机访问
            host: '0.0.0.0',
            proxy:{
                '/note-server':{
                    target: API_TARGET,
                    changeOrigin:true,//允许跨域
                    rewrite:path=>path.replace(/^\/note-server/,'')
                }
            }
        }
    }
)
