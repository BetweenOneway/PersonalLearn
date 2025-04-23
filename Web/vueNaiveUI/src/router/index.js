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
        name: 'CherryMarkdownTest0',
        component: () => import('@/views/CherryMarkdownView.vue'),
    },
    {
        path: '/cherryMarkdown1',
        name: 'CherryMarkdownTest1',
        component: () => import('@/views/CherryMarkdownView1.vue'),
    },
    {
        path: '/editormd',
        name: 'editor-md-v3',
        component: () => import('@/views/EditorMd.vue'),
    },
    {
        path: '/ContainerView',
        name: 'ContainerView',
        component: () => import('@/views/ContainerView.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/Admin.vue'),
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
