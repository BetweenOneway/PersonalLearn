<template>
    <el-container>
        <el-aside width="200px" class="nav-bar">
            <NoteBook />
        </el-aside>
        <el-main>
            main area
        </el-main>
    </el-container>
</template>

<script setup>
    import NoteBook from '@/components/Note/NoteBook.vue';
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');

.nav-bar{
    background-color: var(--shell-color);
}
</style>