import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StartUpView from '@/views/StartUpView.vue'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path:'/startup',
        name:'startup',
        component:StartUpView,
        //redirect:'/home',
        children:[
            {
                path: '',
                name: 'home',
                component: HomeView
            },
            {
                path: '/home',
                name: 'home1',
                component: HomeView
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('../views/AboutView.vue')
            }
        ]
    },
    {
      path: '/',
      name: 'Index',
      component: IndexView
    }
  ]
})

export default router
