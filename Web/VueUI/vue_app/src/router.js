import Vue from 'vue'
import Router from 'vue-router'
import HelloWrold from "./components/HelloWorld.vue"
import Exam01 from "./components/exam/Exam01.vue"
import Exam02 from "./components/exam/Exam02.vue"

Vue.use(Router)
export default new Router({
  routes: [
    //http://127.0.0.1:8080/#/Exam02
    {path:'/Home',component:HelloWrold},
    {path:'/',component:Exam01},
    {path:'/Exam01',component:Exam01},
    {path:'/Exam02',component:Exam02},
  ]
})
