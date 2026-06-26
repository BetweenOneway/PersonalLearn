<template>
  <div class="container">
    <div class="header">
      <div class="icon">🐳</div>
      <h1>DevDockerCompositeDemo</h1>
      <p>DevContainer + Docker Compose 演示</p>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>用户名</label>
        <input
          type="text"
          v-model="username"
          placeholder="请输入任意用户名"
          autocomplete="username"
        />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input
          type="password"
          v-model="password"
          placeholder="请输入任意密码"
          autocomplete="current-password"
        />
      </div>
      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? "登录中..." : "登 录" }}
      </button>
      <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function handleLogin() {
  errorMsg.value = "";
  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = "请输入用户名和密码";
    return;
  }

  loading.value = true;
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      router.push({
        name: "welcome",
        query: {
          username: data.data.username,
          loginTime: data.data.loginTime,
          lastLoginTime: data.data.lastLoginTime || "",
          fromCache: data.data.fromCache ? "1" : "0",
        },
      });
    } else {
      errorMsg.value = data.message || "登录失败";
    }
  } catch (err) {
    errorMsg.value = "网络错误，请检查后端服务是否启动";
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px 40px;
  width: 420px;
  max-width: 95vw;
}

.header {
  text-align: center;
  margin-bottom: 36px;
}

.header .icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.header h1 {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.header p {
  color: #888;
  font-size: 14px;
  margin-top: 6px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.2s;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  margin-top: 12px;
}
</style>
