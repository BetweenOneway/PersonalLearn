import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import Communication from '@/views/Communication.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: IndexView
    },
    {
        path: '/communication',
        name: 'communication',
        component: Communication
    },
    {
        path: '/LifeCycle',
        name: 'LifeCycle',
        component:  ()=>import("@/views/LifeCycle.vue"),
    }
  ]
})

export default router
