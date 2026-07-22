<template>
    <n-grid cols="1" responsive="screen" class="-mt-4">
      <n-grid-item>
        <n-list>
          <n-list-item>
            <n-thing title="账户密码">
                <template #description>
                    <span class="text-gray-400">修改密码、密码找回</span>
                </template>
            </n-thing>
            <template #suffix>
              <n-button type="primary" text @click="handleChangePassword">修改密码</n-button>
            </template>
          </n-list-item>
          <n-list-item>
            <n-thing title="修改邮箱">
                <template #description>
                    <span class="text-gray-400">已绑定邮箱：{{userEmail}}</span>
                </template>
            </n-thing>
            <template #suffix>
              <n-button type="primary" text>修改邮箱</n-button>
            </template>
          </n-list-item>
        </n-list>
      </n-grid-item>
    </n-grid>
  </template>
  
<script setup>
    import { ref, inject } from 'vue'

    const addTab = inject('addTab')
    const userEmail = ref("oneway2021@163.com")

    const handleChangePassword = () => {
        addTab('forget-password', '修改密码', '/admin/forgetpassword')
    }
</script>