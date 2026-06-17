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

const app = createApp(App);
app.use(router);
app.mount("#app");
