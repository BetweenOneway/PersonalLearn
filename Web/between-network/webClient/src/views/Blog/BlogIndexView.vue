<template>
    <div class="blog-container">
        <n-grid x-gap="12" :y-gap="8" :cols="12" item-responsive>
            <n-grid-item span="0 400:2">
                <!--左侧侧边栏-->
            </n-grid-item>
            <n-grid-item span="0 400:8">
                <n-grid :x-gap="12" :y-gap="8" :cols="4">
                    <n-grid-item v-for="(blogItem,index) in blogList" :key="blogItem.id" :data-index="index">
                        <blog-card :blog="blogItem"/>
                    </n-grid-item>
                </n-grid>
            </n-grid-item>
            <n-grid-item span="0 400:2">
                    <!--左侧侧边栏-->
            </n-grid-item>
        </n-grid>
        <n-flex justify="center">
            <n-button v-if="hasMore" @click="GetOpenNoteList()">加载更多</n-button>
        </n-flex>
    </div>
</template>

<script setup>
    import BlogCard from '@/components/blog/BlogCard.vue';
    import { ref } from 'vue';

    import noteServerRequest  from "@/request"
    import noteApi from '@/request/api/noteApi';

    //公开笔记列表 也称为blog
    const blogList = ref([]);
    let hasMore = ref(true);
    let pageIndex = 0;
    let pageSize = 50;

    async function GetOpenNoteList()
    {
        console.log("Get open note list")
        let API = {...noteApi.getOpenNoteList};
        API.name = API.name;
        //请求URL的参数
        API.params= {
            pageIndex:pageIndex,
            pageSize:pageSize
        };

        //发送请求
        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                console.log("Get Open Note list response=>",responseData);
                if(blogList.value.length > 0 )
                {
                    blogList.value = blogList.value.concat(responseData.data);
                }
                else{
                    blogList.value = responseData.data;
                }
                if(responseData.data.length >= pageSize)
                {
                    pageIndex++;
                    hasMore.value = true;
                }
                else{
                    hasMore.value = false;
                }
                
            }
        })
    }

    async function Init()
    {
        pageIndex = 0;
        await GetOpenNoteList();
    }

    Init();
</script>

<style scoped>
    .blog-container{
        width: 100%;
        padding-top: 15px;
    }
</style>