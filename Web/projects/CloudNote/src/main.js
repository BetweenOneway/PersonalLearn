import { createApp } from 'vue'
import { createPinia } from 'pinia'
import eventBus from 'vue3-eventbus'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(eventBus)
app.use(pinia)
app.use(router)

app.mount('#app')
