const { createApp} = Vue;
import MyComponent from './my-component.js'
//import MyComponent1 from './my-component.vue'
// 创建Vue应用
const app = createApp(MyComponent);

// 挂载应用
app.mount('#app');