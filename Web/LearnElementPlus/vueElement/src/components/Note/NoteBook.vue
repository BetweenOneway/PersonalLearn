<template>
    <nav>
        <header>
            <el-space alignment="center">
                <el-space>
                    <el-avatar :icon="UserFilled"/>
                </el-space>
                <el-space direction="vertical">
                    <span class="name">王者伟业</span>
                    <span class="software">Admin</span>
                </el-space>
            </el-space>
        </header>
        <el-space direction="vertical" fill>
            <el-button type="primary" :icon="Plus" size="large">新建</el-button>
            <div >
                <el-menu>
                    <el-menu-item index="1">
                        <el-icon><setting /></el-icon>
                        <span>最近访问</span>
                    </el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon><Folder /></el-icon>
                            <span>我的笔记本</span>
                        </template>
                        <el-scrollbar max-height="200px">
                            <el-menu-item v-for="notebook in noteBookList" :index="notebook.id.toString()" :key="notebook.id">
                            </el-menu-item>
                        </el-scrollbar>
                    </el-sub-menu>
                    <el-menu-item index="3">
                        <el-icon><setting /></el-icon>
                        <span>回收站</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <el-icon><setting /></el-icon>
                        <span>退出登录</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </el-space>
    </nav>
</template>

<script setup>
import { UserFilled,Plus, Folder } from '@element-plus/icons-vue'
import { ref } from 'vue';

//笔记本列表
const noteBookList =[];

let isCollapsed = ref(false);

function toggleNav(){
    isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');

.el-menu {
    border:none;
}
</style>