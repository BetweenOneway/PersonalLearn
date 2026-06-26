import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // HMR 配置（Docker ports 映射已暴露端口，无需 VS Code 转发）
    // Docker 容器中文件系统事件不可靠，启用轮询确保文件变化被检测
    watch: {
      usePolling: true,
      interval: 1000,
    },
    // API 代理：将 /api 请求转发到后端 server 容器
    proxy: {
      "/api": {
        target: "http://server:3000",
        changeOrigin: true,
      },
    },
  },
});
