<template>
    <n-layout embedded content-style="padding:25px">
        <!--轮播图-->
        <n-carousel show-arrow dot-type="line" autoplay>
            <n-a v-for="banner in banners" :key="banner.id" 
            @click="toHerf(banner.to,()=>{},!banner.offsite && !banner.newTab,banner.newTab)">
                <img :src="banner.src" class="carousel-img" >
            </n-a>
        </n-carousel>

        <!--快捷按钮-->
        <n-card style="margin:25px 0" :bordered="false">
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
        <n-card style="height:calc(100% - 140px - 50px - 74px);" content-style="height:calc(100% - 72.69px);" :bordered="false">
            <template #header>
                <h3 style="margin:0">最近记录</h3>
            </template>
            <template #default>
                <n-scrollbar trigger="none" style="height:100%">
                    <n-space>
                        <!--文件卡片-->
                        <fileCard v-for="file in files" :key="file.id+':'+file.type"
                        :id="file.id" :title="file.title" :type="file.type" 
                        :time="file.time"></fileCard>
                    </n-space>
                </n-scrollbar>
            </template>
        </n-card>
    </n-layout>
</template>

<script setup>
    import bus from 'vue3-eventbus'
    import { toHerf,showEditMemoWindow,createNewNote } from '../../router/go';
    import { EventNoteRound,StickyNote2Outlined,ShoppingBagOutlined } from '@vicons/material';
    import fileCard from '../../components/card/fileCard.vue';
    import noteServerRequest from "@/request"
    import fileApi from "@/request/api/fileApi"
    import { useMessage } from "naive-ui";

    //消息对象
    const message = useMessage()

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
                //前往笔记页，并新增笔记
                createNewNote()
            }
        },
        {
            key:'add-memo',
            text:'新增便签',
            icon:EventNoteRound,
            type:'info',
            onClick:()=>{
                //跳转到便签页 
                showEditMemoWindow()
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

    //最近操作的文件
    /**
     * 最近操作的文件 对象数组
     * {id,title,type,time}
     */
    const files = ref([]);

    const getRecentFiles = ()=>{
        noteServerRequest(fileApi.getRecentlyUse).then(responseData=>{
            if(!responseData) return;
            files.value = responseData.data;
        }
        )
    }

    getRecentFiles();

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