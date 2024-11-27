<script setup>
import { ref } from 'vue';
//广告图
const banners= ref([
    {
        id:1,
        src:"https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg",
        to:"",
        offsite:true,//是否站外地址
        newTab:true//是否新标签页方式打开
    },
    {
        id:2,
        src:"https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg",
        to:"",
        offsite:true,//是否站外地址
        newTab:true//是否新标签页方式打开
    },
    {
        id:3,
        src:"https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg",
        to:"",
        offsite:true,//是否站外地址
        newTab:true//是否新标签页方式打开
    },
    {
        id:4,
        src:"https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg",
        to:"",
        offsite:true,//是否站外地址
        newTab:true//是否新标签页方式打开
    },
]);
</script>

<template>
    <el-carousel >
        <el-carousel-item v-for="banner in banners" :key="banner.id" @click="void(0)">
            <el-image :src="banner.src" @click="" style="width:100%;height: 100%;" fit="cover"></el-image>
        </el-carousel-item>
    </el-carousel>
</template>

<style>
.el-carousel{
    height:100%;
}

.el-carousel__container
{
    height: 100% !important;
}
</style>
