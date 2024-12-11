<template>
    <el-container>
        <el-main class="login-container">
            <div class="login-card-container">
                <el-card class="login-card">
                    <el-space >
                        <el-link href="/" :underline="false">
                            <el-image style="width: 300px; height: 300px" :src="logoDarkImage"></el-image>
                        </el-link>
                    </el-space>
                    <el-form label-position="top" :model="loginInfo" label-width="auto" style="max-width: 600px" class="login-form">
                        <el-form-item label="用户名" class="input-item">
                            <el-input :prefix-icon="User" v-model="loginInfo.userName" style="width: 100%" placeholder="用户名" class="input-no-border"/>
                        </el-form-item>
                        <el-form-item label="密码" class="input-item">
                            <el-input :prefix-icon="Lock" class="input-no-border" v-model="loginInfo.password" style="width: 100%" type="password" placeholder="密码" show-password/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="large" round class="button">登录</el-button>
                        </el-form-item>
                    </el-form>
                    <el-row justify="space-between">
                        <el-link href="/" :underline="false">
                            <span>注册</span>
                        </el-link>
                        <el-link href="/" :underline="false">
                            <span>忘记密码?</span>
                        </el-link>
                    </el-row>
                </el-card>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
    import { ref } from 'vue'
    import logoDarkImage from '@/assets/img/brand/dark.svg'
    import { User,Lock } from '@element-plus/icons-vue'
    const loginInfo = ref({
        userName:'',
        password:''
    })
</script>

<style scoped>
    @import url('@/assets/main.css');

    .login-container{
        background-color: #dde5f4;
    }
    .login-card-container{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .login-card{
        display: flex;
        flex-direction: column;
        background:#f1f7fe;
        border-radius: 30px;
        padding:2em;
    }

    .input-no-border :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        padding: 0;
    }

    .input-item{
        background: white;
        box-shadow: 0 0 2em #e6e9f9;
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        border-radius: 20px;
        color: #4d4d4d;
    }

    .input-no-border :deep(.el-input__inner:focus) {
        border-bottom: 1px solid #dde5f4;
    }

    .button {
        padding: 1em;
        width: 100%;
    }
</style>