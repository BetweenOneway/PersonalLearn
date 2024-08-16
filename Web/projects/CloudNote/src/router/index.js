import { createRouter, createWebHistory } from 'vue-router'
import ThingIndexView from "../views/thing/ThingIndexView.vue"

const routes = [
    {
        path:'/memo',
        component:ThingIndexView
    },
    {
        path:'/note',
        component:()=>import('../views/note/IndexView.vue'),
        children:[
            {
                path:'edit/:id',
                props:true,
                component:()=>import('../views/note/EditNote.vue')
            }
        ]
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
