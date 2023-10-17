import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import MintUI from "mint-ui"
import "mint-ui/lib/style.css"


Vue.use(MintUI)

import "./font/iconfont.css"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
