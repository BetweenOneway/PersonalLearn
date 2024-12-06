<template>
    <div style="background-color:#E4E9F7">
        <el-container style="position:relative">
            <div class="function-menu">function menu
                <el-icon class="toggle" @click="toggleNav"><ArrowRight /></el-icon>
            </div>
            <el-container>
                <el-aside class="show-box" width="312px">笔记本内容区域</el-aside>
                <el-container class="show-box">
                    <el-header class="show-box">标题栏</el-header>
                    <el-main class="show-box">编辑器区域</el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
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