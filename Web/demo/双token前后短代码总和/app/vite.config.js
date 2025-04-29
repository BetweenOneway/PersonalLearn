import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        // 代理名称   凡是使用/api开头的地址都是用此代理
        target: "http://localhost:3000/", // 需要代理访问的api地址
        changeOrigin: true, // 允许跨域请求
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})