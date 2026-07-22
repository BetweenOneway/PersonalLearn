<template>
    <div class="safety-cards">
      <n-card class="safety-card" title="账户密码" size="small">
        <p class="card-desc">修改密码、密码找回</p>
        <n-button type="primary" text @click="handleChangePassword">修改密码</n-button>
      </n-card>
      <n-card class="safety-card" title="修改邮箱" size="small">
        <p class="card-desc">已绑定邮箱：{{ userEmail }}</p>
        <n-button type="primary" text>修改邮箱</n-button>
      </n-card>
    </div>
  </template>
  
<script setup>
    import { ref, inject } from 'vue'

    const addTab = inject('addTab')
    const userEmail = ref("oneway2021@163.com")

    const handleChangePassword = () => {
        addTab('forget-password', '修改密码', '/admin/forgetpassword')
    }
</script>

<style scoped>
.safety-cards {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    padding: 0 24px;
}
.safety-card {
    flex: 0 0 320px;
}
.card-desc {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: #999;
}
</style>