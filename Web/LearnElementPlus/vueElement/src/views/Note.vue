<template>
    <el-container>
        <el-header>
            <MainTopToolBar2 />
        </el-header>
        <el-aside width="200px" height="100%">
            <NoteBook />
        </el-aside>
        <el-main>
            main area
        </el-main>
    </el-container>
</template>

<script setup>
    import MainTopToolBar2 from '@/components/MainTopToolBar2.vue';
    import NoteBook from '@/components/Note/NoteBook.vue';
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');
.show-box{
    border:1px solid black;
    box-sizing: border-box;
}

.function-menu{
    border:1px solid black;
    box-sizing: border-box;
    position:fixed;
    width:20%;
    height:100vh;
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
</style>