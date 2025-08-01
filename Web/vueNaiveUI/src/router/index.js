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
        path: '/test',
        name: 'test',
        component: () => import('@/views/Test.vue'),
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
        children:[
            {
                path:'about',
                props:true,
                component:()=>import("@/components/admin/About.vue"),
                meta:{title:'Admin/About'}
            },
            {
                path:'contact',
                props:true,
                component:()=>import("@/components/admin/Contact.vue"),
                meta:{title:'Admin/Contact'}
            },
        ]
    },
    {
        path: '/router',
        name: 'Router',
        component: () => import('@/views/Router.vue'),
        children:[
            {
                path:'routerview1',
                props:true,
                component:()=>import("@/components/router/RouterView1.vue"),
                meta:{title:'Router/RouterView1'}
            },
            {
                path:'routerview2',
                props:true,
                component:()=>import("@/components/router/RouterView2.vue"),
                meta:{title:'Router/RouterView2'}
            },
        ]
    },
    {
        path: '/Layout',
        name: 'LayoutView',
        component: () => import('@/views/LayoutView.vue'),
    },
    {
        path: '/CropperJs2',
        name: 'Cropper2',
        component: () => import('@/views/CropperJs2.vue'),
    },
    {
        path: '/Cropperjs1',
        name: 'Cropperjs2.0',
        component: () => import('@/views/CropperJs1.vue'),
    },
    {
        path: '/VueCropper',
        name: 'VueCropper',
        component: () => import('@/views/VueCropper.vue'),
    },
    {
        path: '/VueCropper1',
        name: 'VueCropper1',
        component: () => import('@/views/VueCropper1.vue'),
    },
    {
        path: '/ListView',
        name: 'ListView',
        component: () => import('@/views/ListView.vue'),
    },
    {
        path: '/Reuseable',
        name: '可重用子组件',
        component: () => import('@/views/ReuseableComponentView.vue'),
    },
    {
        path: '/Cards',
        name: '卡片组件',
        component: () => import('@/views/CardsView.vue'),
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
