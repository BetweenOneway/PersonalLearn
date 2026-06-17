import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // API 代理：将 /api 请求转发到后端 server 容器
    proxy: {
      "/api": {
        target: "http://server:3000",
        changeOrigin: true,
      },
    },
  },
});
