<template>
    <div class="form-container">
        <h2 class="form-title">添加用户</h2>
        <input v-model="username" type="text" placeholder="用户名" class="form-input" />
        <input v-model="password" type="password" placeholder="密码" class="form-input" />
        <input v-model="phone" type="text" placeholder="手机号" class="form-input" />
        <button @click="add" class="form-button">添加</button>
        <pre v-if="errorMessage" class="error-message">{{ errorMessage }}</pre>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import houseApi from '../axios';

const username = ref('');
const password = ref('');
const phone = ref('');
const errorMessage = ref(null);

const add = async () => {
    errorMessage.value = null; // 重置错误消息
    try {
        const { data: { code, message } } = await houseApi.post('/login/add', {
            username: username.value,
            password: password.value,
            phone: phone.value
        });

        if (code === 200) {
            alert('用户添加成功');
            // 可以清空输入框或其他操作
        } else {
            errorMessage.value = message || '添加失败';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || '网络错误';
    }
};
</script>

<style scoped>
body {
    background: linear-gradient(135deg, #74ebd5, #9face6);
}

.form-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.form-title {
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #333;
}

.form-input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.3s;
}

.form-input:focus {
    border-color: #74ebd5;
    outline: none;
}

.form-button {
    width: 100%;
    padding: 10px;
    background: #74ebd5;
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.form-button:hover {
    background: #9face6;
}

.error-message {
    color: red;
    margin-top: 10px;
    font-size: 0.9em;
    text-align: left;
}
</style>
