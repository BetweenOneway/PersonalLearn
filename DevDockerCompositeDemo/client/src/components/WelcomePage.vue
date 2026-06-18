<template>
  <div class="container">
    <div class="avatar">{{ initial }}</div>
    <h2>欢迎 {{ username }} 登录</h2>

    <span class="cache-badge" :class="fromCache ? 'hit' : 'miss'">
      {{ fromCache ? "♻️ 缓存命中（未写数据库）" : "📝 已写入数据库" }}
    </span>

    <div class="info-card">
      <div class="label">本次登录时间</div>
      <div class="value">{{ formattedLoginTime }}</div>
    </div>
    <div class="info-card">
      <div class="label">上次登录时间</div>
      <div class="value">{{ formattedLastLoginTime }}</div>
    </div>
    <div class="info-card" v-if="fromCache">
      <div class="label">缓存说明</div>
      <div class="value">
        该用户在 15 分钟内已登录过，本次请求从 Redis 缓存返回，未更新数据库
      </div>
    </div>

    <button class="btn-secondary" @click="logout">退出登录</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const username = ref(route.query.username || "");
const fromCache = ref(route.query.fromCache === "1");
const loginTime = ref(route.query.loginTime || "");
const lastLoginTime = ref(route.query.lastLoginTime || "");

const initial = computed(() => username.value.charAt(0).toUpperCase());

const formattedLoginTime = computed(() => formatTime(loginTime.value));
const formattedLastLoginTime = computed(() => formatTime(lastLoginTime.value));

function formatTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function logout() {
  router.push({ name: "login" });
}

onMounted(() => {
  if (!username.value) {
    router.push({ name: "login" });
  }
});
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px 40px;
  width: 420px;
  max-width: 95vw;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 16px;
}

.cache-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
}

.cache-badge.hit {
  background: #e8f5e9;
  color: #2e7d32;
}

.cache-badge.miss {
  background: #fff3e0;
  color: #e65100;
}

.info-card {
  background: #f8f9ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  text-align: left;
  font-size: 14px;
}

.info-card .label {
  color: #888;
  font-size: 12px;
  margin-bottom: 4px;
}

.info-card .value {
  color: #333;
  font-weight: 500;
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: #f0f0f0;
  color: #555;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 16px;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
