<template>
    <!--再套一个div，原来的flex布局会失效-->
    <div style="width: 100%;height: 100%;">
        <div class="container">
            <img class="item" src="../../assets/img/avatar/rumi.jpeg" alt="">
            <img class="item" src="../../assets/img/avatar/rumi.jpeg" alt="">
        </div>
    </div>

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
    flex:1;
    width: 100%;
    object-fit: contain;
}
</style>