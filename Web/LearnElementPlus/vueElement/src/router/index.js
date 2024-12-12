import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Note from '@/views/Note.vue'
import User from '@/views/user/User.vue'
import Login from '@/components/User/Login.vue'
import Register from '@/components/User/Register.vue'
//以下为测试用
import Test from '@/views/test/test.vue'
import menu from '@/components/test/menu.vue'
import layout from '@/components/test/layout.vue'
import element from '@/components/test/element.vue'
import card from '@/components/test/card.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path:'/user',
        name: 'user',
        component: User,
        children: [
            {
                //path不要带'/'
                path: 'login', 
                component: Login 
            },
            {
                //path不要带'/'
                path: 'register', 
                component: Register 
            },
        ]
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
                // 当 /test/element 匹配成功，
                path: 'element',
                component: element
            },
            {
                // 当 /test/card 匹配成功，
                path: 'card',
                component: card
            },
        ]
    },
  ],
})

export default router
