<template>
    <h3>标题</h3>
    <!--滚动条不会遮挡上面的标题，只会在div内滚动-->
    <div class="container">
        <n-scrollbar>
            <h2 v-for="i in 50">内容1</h2>
        </n-scrollbar>
    </div>
    
</template>

<script setup>
</script>

<style scoped>
    .container{
        border: 1px solid black;
        width: 400px;
        height: 400px;
    }

</style>