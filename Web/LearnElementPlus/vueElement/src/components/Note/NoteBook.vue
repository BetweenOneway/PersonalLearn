<template>
    <el-aside :width="isCollapsed ? '64px':'200px'">
        <nav class="shell" >
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
                <el-icon class="toggle" @click="toggleNav"><ArrowRight /></el-icon>
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
                <div style="margin:auto 0 auto">hello</div>
            </el-space>
        </nav>
    </el-aside>
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

.shell{
    position:fixed;
    top:0;
    left:0;
    height:100%;
    padding:10px 14px;
    transition:all 0.3s ease;
    z-index: 100;
    background-color: #FFF;
}
header {
    position:relative;
}
.toggle {
    position:absolute;
    top:50%;
    right: -25px;
    transform: translateY(-50%) rotate(180deg);
    height: 25px;
    width: 25px;
    background-color: #695CFE;
    color: #FFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size:15px;
    cursor: pointer;
    transition: all .3s ease;
}
.el-menu {
    border:none;
}
</style>