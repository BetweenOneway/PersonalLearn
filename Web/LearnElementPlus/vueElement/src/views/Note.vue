<template>
    <el-container>
        <el-aside width="200px" class="nav-bar">
            <NoteNav />
        </el-aside>
        <el-container>
            <el-aside width="200px">
                <NoteList />
            </el-aside>
            <NoteEdit />
        </el-container>
    </el-container>
</template>

<script setup>
    import NoteNav from '@/components/Note/NoteNav.vue';
    import NoteList from '@/components/Note/NoteList.vue';
    import NoteEdit from '@/components/Note/NoteEdit.vue';
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