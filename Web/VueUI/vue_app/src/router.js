import Vue from 'vue'
import Router from 'vue-router'
import HelloWrold from "./components/HelloWorld.vue"
import Exam01 from "./components/exam/Exam01.vue"
import Exam02 from "./components/exam/Exam02.vue"
import Tab from "./components/exam/Tab.vue"
import Tabbar from "./components/exam/Tabbar.vue"
import Fa08 from "./components/exam/Fa08.vue"

Vue.use(Router)
export default new Router({
  routes: [
    //http://127.0.0.1:8080/#/Exam02
    {path:'/Home',component:HelloWrold},
    {path:'/',component:Exam01},
    {path:'/Exam01',component:Exam01},
    {path:'/Exam02',component:Exam02},
    {path:'/Tab',component:Tab},
    {path:'/Tabbar',component:Tabbar},
    {path:'/Fa08',component:Fa08},
  ]
})
