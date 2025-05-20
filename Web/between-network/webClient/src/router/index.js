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
                path:'updatepersonalinfo',
                props:true,
                //component:()=>import("@/components/admin/UpdatePersonalInfo.vue"),
                component:()=>import("@/components/admin/account/AccountSetting.vue"),
                meta:{title:'更新个人信息'}
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
        path: '/test',
        component: ()=>import("@/views/test/Index.vue"),
        children:[
            {
                path:'imgcontainer',
                props:true,
                component:()=>import("@/components/test/imgContainer.vue"),
                meta:{title:'img-container'}
            },
            {
                path:'expandMenu',
                props:true,
                component:()=>import("@/components/test/expandMenu.vue"),
                meta:{title:'expand menu'}
            },
            {
                path:'split',
                props:true,
                component:()=>import("@/components/test/split.vue"),
                meta:{title:'split'}
            },
        ]
    },
  ],
})

export default router
