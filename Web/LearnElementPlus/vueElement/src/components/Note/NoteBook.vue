<template>
    <div class="sidebar">
        <el-row justify="space-around">
            <el-avatar :icon="UserFilled"/>
            <el-space direction="vertical">
                <span>王者伟业</span>
                <span>Admin</span>
            </el-space>
        </el-row>
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
    </div>
</template>

<script setup>
import { UserFilled,Plus, Folder } from '@element-plus/icons-vue'

const noteBookList =[];
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');

.sidebar{
    padding-top: 32px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}
.sidebar-operate{
    padding: 10px 0;
    height: 40px;
}
.sidebar-content{
    margin-top: 12px;
    padding-bottom: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}
.userinfo {
    margin:16px auto 0;
}

.expand-layout{
    min-height: 360px;
    box-sizing: border-box;
}
</style>