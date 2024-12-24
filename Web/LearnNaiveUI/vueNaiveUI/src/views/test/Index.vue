<template>
    <div class="container">
        <img class="item" src="../../assets/img/avatar/rumi.jpeg" alt="">
        <img class="item" src="../../assets/img/avatar/rumi.jpeg" alt="">
    </div>
    <n-flex justify="space-between" align="center" style="width:100%;margin:0 auto" :wrap="false">
        <n-button>Oops 2</n-button>
    </n-flex>
</template>

<script setup>
import illustration3 from '@/assets/img/illustrations/illustration-3.svg'
</script>

<style scoped>
.container{
    display: flex;
    width: 100%;
    margin:0 auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
}

.item{
    border: 1px solid red;
    width: 300px;
    height: 100px;
    object-fit: fill;
}

.block{
    border: 1px solid red;
}
</style>