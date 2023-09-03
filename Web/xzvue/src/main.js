import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import MyHeader from './components/MyHeader'

Vue.config.productionTip = false
Vue.prototype.axios = axios;
Vue.component("my-header",MyHeader);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
