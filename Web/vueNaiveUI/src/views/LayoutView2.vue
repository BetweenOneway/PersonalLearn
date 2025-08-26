<!--测试Naive UI组件和原生HTML标签的组合使用-->
<template>
    <div class="box-container">
        <div class="box-title">
            表头
        </div>
        <div class="box-body">
            <div class="box-content">
                <h2 v-for="i in 50">内容区域</h2>
            </div>
        </div>
        <div class="box-footer">
            尾部区域
        </div>
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
    }
    .box-title{
        position: fixed;
        z-index: 1000;
        height: 64px;
        border: 1px solid red;
    }
    .box-body{
        position: relative;
        top: 66px;
        border: 1px solid black;
        /* height:calc(100% - 64px); */
        height:400px;
        overflow: auto;
    }
    .box-footer{
        border: 1px solid blue;
        position: relative;
        top: 66px;
        height: 50px;
    }
</style>