<template>
    <el-space direction="vertical" class="nav">
        <el-space>
            <el-link href="/" :underline="false">
                <el-image :src="logoDarkImage"></el-image>
            </el-link>
        </el-space>
        <!--用户信息区域-->
        <el-space direction="horizontal" alignment="center" class="user">
            <span class="image">
                <el-avatar :icon="UserFilled"/>
            </span>
            <el-space direction="vertical" alignment="center" class="text">
                <span class="name">王者伟业</span>
                <span class="software">Admin</span>
            </el-space>
        </el-space>
        <!--功能按钮区域-->
        <div>
            <el-button type="primary" :icon="Plus">新建笔记</el-button>
        </div>
        <!--笔记列表区域-->
        <el-space>
            <el-menu :collapse="isCollapsed">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><location /></el-icon>
                        <span>我的文件夹</span>
                    </template>
                    <el-menu-item index="1-1">笔记文件1</el-menu-item>
                    <el-menu-item index="1-2">笔记文件2</el-menu-item>
                    <el-sub-menu index="1-4">
                        <template #title>子文件夹</template>
                        <el-menu-item index="1-4-1">子文件1</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                    <el-icon><Delete /></el-icon>
                    <span>回收站</span>
                </el-menu-item>
            </el-menu>
        </el-space>
    </el-space>
</template>

<script setup>
import { Plus, Delete, UserFilled } from '@element-plus/icons-vue'
import { ref } from 'vue';
import logoDarkImage from '@/assets/img/brand/dark.svg'

//笔记本列表
const noteBookList =[];

let isCollapsed = ref(false);

let menulist=ref([]);

function loadNoteList()
{

}

</script>

<style scoped>
.block{
    min-width: 100px;
    min-height: 100px;
    box-sizing:border-box;
    border: 1px solid red;
}

.nav{
    padding:10px 14px;
}
.image img {
    width: 45px;
    border-radius: 6px;
}
.el-menu{
    border:none
}
.text{
    font: 500 17px "";
    white-space: nowrap;
    opacity: 1;
}

.name {
    margin-top: 2px;
    font:600 18px;
}

.software {
    font-size: 20px;
    margin-top: -2px;
    display: block;
}

.user{
    margin-top: 20px;
}
</style>