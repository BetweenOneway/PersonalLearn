import { createRouter, createWebHistory } from 'vue-router'
//预加载
import EditNoteView from '../views/note/EditNote.vue';

const routes = [
    {
        path:'/memo',
        component:import("../views/thing/ThingIndexView.vue"),
        meta:{title:'便签页'}
    },
    {
        path:'/note',
        component:()=>import('../views/note/IndexView.vue'),
        meta:{title:'笔记页'},
        children:[
            {
                path:'edit/:id',
                props:true,
                component:EditNoteView,
                meta:{title:'笔记编辑页'}
            }
        ]
    },
    {
        path:'/404',
        component:()=>import('../views/result/NoteFoundView.vue'),
        meta:{title:'404'}
    },
    {
        path:'/:pathMatch(.*)',
        redirect:'/404'
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//前置守卫 路由跳转之前的处理
router.beforeEach((to,from,next)=>{

    //如果跳转路由规则中含有标题，则更改页面标签页标题
    if(to.meta.title)
    {
        document.title = to.meta.title;
    }

    //跳转至指定路由
    next();
})

export default router
