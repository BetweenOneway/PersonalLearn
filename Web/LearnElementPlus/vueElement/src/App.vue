<script setup>

import { RouterView } from 'vue-router';
import MainTopToolBar from './components/MainTopToolBar.vue';
</script>

<template>
    <el-container>
        <el-header style="height: 64px;padding:0 20px;">
            <MainTopToolBar></MainTopToolBar>
        </el-header>
        <el-main>
            <RouterView />
        </el-main>
    </el-container>
</template>

<style scoped>
    .el-container{
        height: 100vh;
    }
</style>
