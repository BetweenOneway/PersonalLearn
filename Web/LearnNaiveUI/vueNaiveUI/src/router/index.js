import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: import("@/views/Home/Index.vue"),
    },
    {
        path: '/test',
        component: import("@/views/test/Index.vue"),
    },
  ],
})

export default router
