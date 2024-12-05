import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Note from '@/views/Note.vue'
import Test from '@/views/test.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/note',
        name: 'note',
        component: Note,
    },
    {
        path: '/test',
        name: 'test',
        component: Test,
    },
  ],
})

export default router
