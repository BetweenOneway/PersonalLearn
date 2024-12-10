<template>
    <el-container>
        <el-card>
            <el-space>
                <el-link href="/" :underline="false">
                    <el-image :src="logoDarkImage"></el-image>
                </el-link>
            </el-space>
            <el-form :model="loginInfo" label-width="auto" style="max-width: 600px">
                <el-form-item label="用户名">
                    <el-input v-model="loginInfo.userName" style="width: 240px" placeholder="用户名" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="loginInfo.password" style="width: 240px" type="password" placeholder="密码" show-password/>
                </el-form-item>
                <el-form-item>
                    <el-button>登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-container>
</template>

<script setup>
    import { ref } from 'vue'
    import logoDarkImage from '@/assets/img/brand/dark.svg'
    const loginInfo = ref({
        userName:'',
        password:''
    })
</script>

<style scoped></style>