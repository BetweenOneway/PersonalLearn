import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import { createRequire } from 'node:module'
const require = createRequire( import.meta.url )
//import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5' // 引入 ckeditor5 vite 插件

// https://vitejs.dev/config/
export default defineConfig(
    {
        plugins: [
            vue(),
            AutoImport(
                {
                    imports: [
                        'vue',
                        {
                            'naive-ui': [
                            'useDialog',
                            'useMessage',
                            'useNotification',
                            'useLoadingBar'
                            ]
                        }
                    ]
                }
            ),
            Components(
                {
                    resolvers: [NaiveUiResolver()]
                }
            ),
            //ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') }) // ckeditor5 插件
        ],
        resolve: {
            alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
            }
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
