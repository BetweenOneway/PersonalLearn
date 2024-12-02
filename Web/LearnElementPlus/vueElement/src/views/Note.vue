<template>
    <div>
        <el-container>
            <el-aside width="208px">
                <el-space class="sidebar">
                    Avatar
                </el-space>
            </el-aside>
            <el-container>
                <el-aside width="312px">笔记本内容区域</el-aside>
                <el-container>
                    <el-header>标题栏</el-header>
                    <el-main>编辑器区域</el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');
.sidebar{
    padding-top: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    box-sizing: border-box;
}
</style>