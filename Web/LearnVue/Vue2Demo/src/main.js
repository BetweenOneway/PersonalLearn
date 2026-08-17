//启动代码
import Vue from '../lib/vue.js'
import App from './App.js'

new Vue({
    el:'#app',
    data:{
        title:'My First Vue',
    },
    //局部注册
    components:{
        'app':App
    },
    template:`<app></app>`,
    render(h){
        //效果和template一样,这个方式连组件都不需要注册
        return h(App)
    }
})

//Vue挂载的第二种方式，与el效果相同
/*
const vm = new Vue()
vue.$mount('#app')
*/