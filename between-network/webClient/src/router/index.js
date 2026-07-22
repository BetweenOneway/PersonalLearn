import { createRouter, createWebHistory } from 'vue-router'

import EditNote from '@/components/note/EditNote.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ()=>import("@/views/Home/Index.vue"),
    },
    {
        path: '/note',
        component: ()=>import("@/views/Note/NoteIndex.vue"),
        meta:{title:'笔记页'},
        children:[
            {
                path:'edit/:id',
                props:true,
                component:EditNote,
                meta:{title:'笔记编辑页'}
            }
        ]
    },
    {
        path: '/admin',
        name: '后台管理',
        component: () => import('@/views/Admin/Index.vue'),
        redirect: '/admin/console',
        children:[
            {
                path:'console',
                props:true,
                component:()=>import("@/components/admin/Console.vue"),
                meta:{title:'主控台'}
            },
            {
                path:'basicsetting',
                props:true,
                component:()=>import("@/components/admin/account/BasicSetting.vue"),
                meta:{title:'基本设置'}
            },
            {
                path:'safetysetting',
                props:true,
                component:()=>import("@/components/admin/account/SafetySetting.vue"),
                meta:{title:'安全设置'}
            },
            {
                path:'forgetpassword',
                props:true,
                component:()=>import("@/components/admin/ForgetPassword.vue"),
                meta:{title:'忘记密码'}
            },
            {
                path:'recycle',
                props:true,
                component:()=>import("@/components/admin/Recycle.vue"),
                meta:{title:'回收站'}
            },
        ]
    },
    {
        path: '/blog',
        component: ()=>import("@/views/Blog/BlogIndexView.vue"),
        meta:{title:'博客页'},
    },
    {
        path: '/article/:id',
        props:true,
        component: ()=>import("@/views/Blog/ArticleDetailView.vue"),
        meta:{title:'博客页'},
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: ()=>import("@/views/NotFound/404.vue"),
        meta:{title:'404'},
    },
  ],
})

export default router
