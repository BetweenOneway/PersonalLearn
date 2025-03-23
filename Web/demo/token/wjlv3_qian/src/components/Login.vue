<template>
    <div class="login-container">
        <h1 class="login-title">Login</h1>
        <div class="input-group">
            <input v-model="username" class="login-input" placeholder="Username" />
            <input v-model="password" type="password" class="login-input" placeholder="Password" />
            <button @click="login" class="login-button">Login</button>
        </div>

        <pre v-if="errorMessage" class="error-message">{{ errorMessage }}</pre>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import houseApi from '../axios'

const username = ref('')
const password = ref('')
const errorMessage = ref(null)
const router = useRouter()

const login = async () => {
    errorMessage.value = null // 重置错误消息
    try {
        const response = await houseApi.post('/login/userLogin', {
            username: username.value,
            password: password.value
        })

        console.log(response)
        if (response.data.code === 1) {
            alert(response.data.message)
        } else if (response.data.code === 2) {
            alert(response.data.message)
        } else {
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            router.push('/home') // 登录成功后跳转
        }
    } catch (error) {
        // 处理错误
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Login failed'
        } else {
            errorMessage.value = 'An unexpected error occurred'
        }
    }
}
</script>

<style scoped>
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #74ebd5, #9face6);
}

.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.login-title {
    font-size: 2em;
    margin-bottom: 20px;
    color: #333;
}

.input-group {
    margin: 10px 0;
}

.login-input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.3s;
}

.login-input:focus {
    border-color: #74ebd5;
    outline: none;
}

.login-button {
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

.login-button:hover {
    background: #9face6;
}

.error-message {
    color: red;
    margin-top: 10px;
    font-size: 0.9em;
}
</style>
