<template>
    <el-container>
        <el-aside width="200px" class="nav-bar">
            <NoteNav />
        </el-aside>
        <el-container>
            <el-aside width="200px">
                <NoteList />
            </el-aside>
            <el-container class="note-container">
                <el-header>标题区域</el-header>
                <el-main>笔记内容区域</el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup>
    import NoteNav from '@/components/Note/NoteNav.vue';
    import NoteList from '@/components/Note/NoteList.vue';
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');

.nav-bar{
    background-color: var(--shell-color);
}

.note-container{
    border-left: 1px solid #f0f3f5;
}
</style>