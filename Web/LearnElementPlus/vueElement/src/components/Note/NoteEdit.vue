<template>
    <el-container class="note-container">
    <el-header>
        <el-row justify="space-between" align="middle" style="width:100%" class="note-header">
            <!--标题区域-->
            <el-space>
                <el-text>笔记标题</el-text>
            </el-space>
            <!--功能按钮区域-->
            <el-space>
                <el-button>保存</el-button>
                <el-icon>
                    <More/>
                </el-icon>
            </el-space>
        </el-row>
    </el-header>
    <el-main>笔记内容区域</el-main>
    </el-container>
</template>

<script setup>
    import { More } from '@element-plus/icons-vue'
</script>

<style scoped>
@import url('@/assets/main.css');

.note-container{
    border-left: 1px solid #f0f3f5;
}

.note-header{
    height: 77px;
    padding:0 24px;
    border-bottom: 1px solid #f0f3f5;
}
</style>