import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Note from '@/views/Note.vue'
import Login from '@/views/user/Login.vue'
import Test from '@/views/test/test.vue'
import menu from '@/components/test/menu.vue'
import layout from '@/components/test/layout.vue'
import element from '@/components/test/element.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
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
            {
                // 当 /test/layout 匹配成功，
                path: 'element',
                component: element
              },
        ]
    },
  ],
})

export default router
