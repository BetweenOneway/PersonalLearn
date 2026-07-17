<template>
  <div class="not-found-wrapper">
    <!-- 服务端 EJS 渲染的 404 内容将注入此处 -->
    <div v-if="ejsHtml" v-html="ejsHtml"></div>

    <!-- 加载中占位 -->
    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>正在从 EJS 模板引擎加载 404 页面...</p>
    </div>

    <!-- 加载失败时的本地 404 兜底 -->
    <div v-else class="not-found">
      <div class="code">404</div>
      <div class="message">页面未找到</div>
      <p style="color:#999;">
        路径 <code>{{ route.fullPath }}</code> 不存在
      </p>
      <p style="margin-top:1.5rem;">
        <router-link to="/" class="go-home">← 返回首页</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const ejsHtml = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`/ssr/404?path=${encodeURIComponent(route.fullPath)}`)
    if (res.ok) {
      ejsHtml.value = await res.text()
    } else {
      loading.value = false
    }
  } catch {
    // 服务不可用时使用本地兜底
    loading.value = false
  } finally {
    loading.value = ejsHtml.value ? false : loading.value
  }
})
</script>

<style scoped>
.not-found-wrapper {
  /* EJS 返回的 HTML 直接展示，不需要额外包裹样式 */
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 本地兜底 404 样式 */
.not-found {
  text-align: center;
  margin-top: 4rem;
}

.not-found .code {
  font-size: 6rem;
  font-weight: 800;
  color: #667eea;
  line-height: 1;
}

.not-found .message {
  font-size: 1.5rem;
  color: #888;
  margin: 1rem 0 2rem;
}

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
