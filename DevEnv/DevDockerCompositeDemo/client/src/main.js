import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import LoginPage from "./components/LoginPage.vue";
import WelcomePage from "./components/WelcomePage.vue";

const routes = [
  { path: "/", name: "login", component: LoginPage },
  { path: "/welcome", name: "welcome", component: WelcomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// ===== 诊断：追踪所有可能导致"刷新"的事件 =====
window.addEventListener("visibilitychange", () => {
    console.log("[诊断] visibilitychange:", document.hidden ? "隐藏" : "可见", new Date().toISOString());
    console.trace("[诊断] visibilitychange 调用栈");
  });
  
  window.addEventListener("resize", () => {
    console.log("[诊断] resize:", window.innerWidth, "x", window.innerHeight, new Date().toISOString());
  });
  
  window.addEventListener("beforeunload", (e) => {
    console.log("[诊断] beforeunload — 页面即将卸载!", new Date().toISOString());
  });
  
  window.addEventListener("pagehide", (e) => {
    console.log("[诊断] pagehide — persisted:", e.persisted, new Date().toISOString());
  });
  
  window.addEventListener("pageshow", (e) => {
    console.log("[诊断] pageshow — persisted:", e.persisted, new Date().toISOString());
  });
  
  // 监听路由变化
  router.beforeEach((to, from) => {
    console.log("[诊断] 路由变化:", from.fullPath, "→", to.fullPath, new Date().toISOString());
  });
  
  // 记录应用挂载
  console.log("[诊断] Vue 应用挂载完成", new Date().toISOString());
  
const app = createApp(App);
app.use(router);
app.mount("#app");
