import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Note from '@/views/Note.vue'
import Test from '@/views/test/test.vue'
import menu from '@/components/test/menu.vue'
import layout from '@/components/test/layout.vue'
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
        children: [
            { 
                path: '', 
                component: menu 
            },
            {
              // 当 /test/layout 匹配成功，
              path: 'layout',
              component: layout
            },
        ]
    },
  ],
})

export default router
