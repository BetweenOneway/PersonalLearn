<template>
  <div class="about">
    <div class="card">
      <h1>关于本项目</h1>
      <p>这是一个 Vue 3 客户端项目，配合 Node.js + EJS 服务端使用。</p>
    </div>

    <div class="card">
      <h2>项目结构</h2>
      <p>EJS 负责 SEO 友好的页面（首页、商品页等），Vue 负责交互密集的页面（Dashboard、Settings 等）。</p>
      <p>两个渲染方式共用同一套 Node.js 后端 API。</p>
    </div>

    <div class="card">
      <h2>版本信息</h2>
      <p><strong>Vue：</strong>3.4+</p>
      <p><strong>Vue Router：</strong>4.3+</p>
      <p><strong>构建工具：</strong>Vite 5</p>
    </div>
  </div>
</template>

<script setup>
// 纯展示页面，无需逻辑
</script>
