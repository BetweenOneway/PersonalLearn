<template>
    <el-row justify="space-between">
        <el-text>之间</el-text>
        <el-space>
            <el-button v-if="userId === null" @click="toLogin">登录</el-button>
            <el-avatar v-else :icon="UserFilled" @click="showUserMenu"/>
        </el-space>
    </el-row>
</template>

<script setup>
    import { ref } from 'vue';
    import { UserFilled } from '@element-plus/icons-vue'
    let userId = ref(null);

    const toLogin = ()=>{
        userId.value = 1
    }

    const showUserMenu=()=>{
        userId.value = null;
    }
</script>