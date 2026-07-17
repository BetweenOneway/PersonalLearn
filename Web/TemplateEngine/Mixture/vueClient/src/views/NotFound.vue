<template>
  <div class="not-found">
    <div class="code">404</div>
    <div class="message">页面未找到</div>
    <p style="color:#999;">
      路径 <code style="background:#f0f0f0;padding:0.2rem 0.5rem;border-radius:4px;">{{ route.fullPath }}</code> 不存在
    </p>
    <p style="margin-top:1.5rem;">
      <router-link to="/" class="go-home">← 返回首页</router-link>
    </p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.go-home {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.go-home:hover {
  opacity: 0.85;
}
</style>
