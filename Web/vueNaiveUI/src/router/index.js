import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TreeView1 from '@/views/TreeView1.vue'
import TreeView from '@/views/TreeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/tree',
        name: 'tree',
        component: TreeView,
    },
    {
        path: '/tree1',
        name: 'tree1',
        component: TreeView1,
    },
    {
        path: '/for',
        name: 'for',
        component: () => import('@/views/forView.vue'),
    },
    {
        path: '/cherryMarkdown',
        name: 'CherryMarkdown',
        component: () => import('@/views/CherryMarkdownView.vue'),
    },
    {
        path: '/ContainerView',
        name: 'ContainerView',
        component: () => import('@/views/ContainerView.vue'),
    },
    {
      //path: '/about',
      //name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
