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
