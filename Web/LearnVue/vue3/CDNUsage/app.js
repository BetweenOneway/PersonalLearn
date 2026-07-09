const { createApp} = Vue;
import MyComponent from './my-component.js'
//浏览器无法直接解析 .vue 单文件组件，需要构建工具编译。CDN 方式下 Live Server 返回 text/plain MIME 类型，浏览器拒绝加载。
//import MyComponent1 from './my-component.vue'

// 创建Vue应用
const app = createApp(MyComponent);

// 挂载应用
app.mount('#app');