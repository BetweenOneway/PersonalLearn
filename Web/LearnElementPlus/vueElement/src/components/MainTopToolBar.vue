<template>
    <div class="container">
        <el-row justify="space-between" style="height: 100%;">
            <el-link href="https://element-plus.org" :underline="false">
                <el-image :src="logoDarkImage"></el-image>
            </el-link>
            <el-space>
                <el-button type="primary" v-if="userId === null" @click="toLogin">登录</el-button>
                <el-avatar v-else :icon="UserFilled" @click="showUserMenu"/>
            </el-space>
        </el-row>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { UserFilled } from '@element-plus/icons-vue'
    import logoDarkImage from '@/assets/img/brand/dark.svg'

    let userId = ref(null);

    const toLogin = ()=>{
        userId.value = 1
    }

    const showUserMenu=()=>{
        userId.value = null;
    }
</script>

<style scoped>
@import url('@/assets/main.css');
</style>