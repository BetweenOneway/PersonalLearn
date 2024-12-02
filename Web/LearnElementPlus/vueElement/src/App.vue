<script setup>

import { RouterView } from 'vue-router';
import MainTopToolBar from './components/MainTopToolBar.vue';
</script>

<template>
    <el-container>
        <el-header>
            <MainTopToolBar></MainTopToolBar>
        </el-header>
        <el-main>
            <RouterView />
        </el-main>
    </el-container>
</template>

<style scoped>
    @import url('@/assets/main.css');
    .el-container{
        height: 100vh;
    }
    
</style>
