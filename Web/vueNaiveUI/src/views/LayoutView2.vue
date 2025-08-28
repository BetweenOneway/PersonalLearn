<!--测试Naive UI组件和原生HTML标签的组合使用-->
<template>
    <div class="box-container">
        <header class="box-title">
            表头
        </header>
        <section class="box-body">
            <h2 v-for="i in 50">内容区域</h2>
        </section>
        <footer class="box-footer">
            尾部区域
        </footer>
    </div>
</template>

<script setup></script>

<style scoped>
    div{
        box-sizing: border-box;
    }
    .box-container{
        position:relative;
        height: 100vh;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .box-title{
        position: sticky;
        top:0;
        z-index: 1000;
        height: var(--nav-bar-height);
        width: 100%;
        border: 1px solid red;
        text-align: center;
        background-color: white;
    }
    .box-body{
        position: relative;
        border: 1px solid black;
        height:calc(100% - var(--nav-bar-height));
        width: 100%;
        overflow:auto;
    }
    .box-footer{
        border: 1px solid blue;
        position: relative;
        height: 50px;
        width: 100%;
    }
</style>