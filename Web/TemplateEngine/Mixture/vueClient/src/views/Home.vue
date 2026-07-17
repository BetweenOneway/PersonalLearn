<template>
  <div class="home">
    <div class="card" style="text-align:center;">
      <h1>👋 欢迎来到 Vue3 Demo</h1>
      <p>这是一个基于 Vue 3 + Vue Router 的单页应用示例项目</p>
    </div>

    <div class="card">
      <h2>技术栈</h2>
      <div class="features">
        <div class="feature-item">
          <div class="icon">⚡</div>
          <h3>Vite</h3>
          <p>极速开发构建工具</p>
        </div>
        <div class="feature-item">
          <div class="icon">🎨</div>
          <h3>Vue 3</h3>
          <p>Composition API</p>
        </div>
        <div class="feature-item">
          <div class="icon">🚦</div>
          <h3>Vue Router</h3>
          <p>客户端路由管理</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>当前路由信息</h2>
      <p><strong>路由名称：</strong>{{ route.name }}</p>
      <p><strong>路由路径：</strong>{{ route.path }}</p>
      <p style="margin-top:1rem;color:#888;">
        试试导航栏上的链接，或在地址栏输入不存在的路径看看 404 页面
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
