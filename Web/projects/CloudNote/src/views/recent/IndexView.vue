<template>
    <n-space vertical style="width:100%;padding:25px" :size="25">
        <!--轮播图-->
        <n-carousel show-arrow dot-type="line" autoplay>
            <n-a v-for="banner in banners" :key="banner.id" 
            @click="toHerf(banner.to,()=>{},!banner.offsite && !banner.newTab,banner.newTab)">
                <img :src="banner.src" class="carousel-img" >
            </n-a>
        </n-carousel>

        <!--快捷按钮-->
        <n-card :bordered="false">
            <n-space>
                <n-button tertiary v-for="btn in actionButton" :key="btn.key" 
                :type="btn.type" @click="btn.onClick()">
                    <template #icon>
                        <n-icon :component="btn.icon"></n-icon>
                    </template>
                    {{ btn.text }}
                </n-button>
            </n-space>
        </n-card>

        <!--最近记录-->
        <n-card :bordered="false">
            <template #header>
                <h3 style="margin:0">最近记录</h3>
            </template>
            <template #default>
                <n-space>
                    <!--文件卡片-->
                    <fileCard></fileCard>
                </n-space>
            </template>
        </n-card>
    </n-space>
</template>

<script setup>
    import bus from 'vue3-eventbus'
    import { toHerf } from '../../router/go';
    import { EventNoteRound,StickyNote2Outlined,ShoppingBagOutlined } from '@vicons/material';
    import fileCard from '../../components/card/fileCard.vue';

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

    //功能按钮
    const actionButton = [
        {
            key:'add-note',
            text:'新增笔记',
            icon:StickyNote2Outlined,
            type:'success',
            onClick:()=>{
                //跳转至路由为/note
                toHerf("/note",()=>{
                        //出发新增笔记事件
                        bus.emit('createNewNote');
                    }
                )
            }
        },
        {
            key:'add-memo',
            text:'新增便签',
            icon:EventNoteRound,
            type:'info',
            onClick:()=>{
                //跳转至路由为/memo
                toHerf("/memo",()=>{
                        //弹出便签编辑框
                        bus.emit('newCreateMemo');
                    }
                )
            }
        },
        {
            key:'go-shopping',
            text:'购物中心',
            icon:ShoppingBagOutlined,
            type:'error',
            onClick:()=>{
                message.info("尽请期待")
            }
        },
    ];
</script>

<style scoped>
.n-carousel{
    width:100%;
    height:140px;
    border-radius: 10px;
}
.carousel-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
</style>