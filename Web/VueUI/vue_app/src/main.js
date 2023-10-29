import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import MintUI from "mint-ui"
import "mint-ui/lib/style.css"

import axios from "axios"
axios.defaults.withCredentials=true;
//地址栏必须
//http://127.0.0.1:8080/
axios.defaults.baseURL="http://127.0.0.1:8080/"
Vue.prototype.axios=axios;

Vue.use(MintUI)

import "./font/iconfont.css"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
