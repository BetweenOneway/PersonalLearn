import Vue from 'vue'
import Router from 'vue-router'
import HelloWrold from "./components/HelloWorld.vue"
import Exam01 from "./components/exam/Exam01.vue"

Vue.use(Router)
export default new Router({
  routes: [
    {path:'/Home',component:HelloWrold},
    {path:'/',component:Exam01},
    {path:'/Exam01',component:Exam01},
  ]
})
