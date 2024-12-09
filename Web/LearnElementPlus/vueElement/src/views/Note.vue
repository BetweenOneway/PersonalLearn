<template>
    <el-container>
        <el-aside width="200px" class="nav-bar">
            <NoteBook />
        </el-aside>
        <el-container>
            <el-aside width="200px">
                <NoteList />
            </el-aside>
            <el-container>
                <el-header>标题区域</el-header>
                <el-main>笔记内容区域</el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup>
    import NoteBook from '@/components/Note/NoteBook.vue';
    import NoteList from '@/components/Note/NoteList.vue';
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');

.nav-bar{
    background-color: var(--shell-color);
}
</style>