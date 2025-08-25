<template>
    <div style="width: 100%;">
        <n-layout has-sider style="height: 100%;">
            <!--笔记列表及编辑器容器-->
            <n-layout has-sider>
                <!--作者信息区域-->
                <n-layout-sider
                    bordered
                    :width="240"
                >
                    <n-scrollbar >
                        <div class="shell" v-show="!authorInfoLoading">
                            <div class="author">
                                <!--作者信息区域-->
                                <header>
                                    <div class="image-text">
                                        <span class="image">
                                            <img :src=authorInfo.headPic alt="">
                                        </span>
                                        <div class="text logo-text">
                                            <span class="author-name">{{authorInfo.nickName}}</span>
                                            <n-flex class="author-bdage">
                                                <n-icon-wrapper :size="20" :border-radius="10">
                                                    <n-icon :size="18" :component="BookOpen" />
                                                </n-icon-wrapper>
                                                <n-icon-wrapper :size="20" :border-radius="10">
                                                    <n-icon :size="18" :component="BookOpen" />
                                                </n-icon-wrapper>
                                                <n-icon-wrapper :size="20" :border-radius="10">
                                                    <n-icon :size="18" :component="BookOpen" />
                                                </n-icon-wrapper>
                                            </n-flex>
                                        </div>
                                    </div>
                                </header>
                                <!--作者基本成就区域-->
                                <div class="profile-intro-rank">
                                    <n-flex class="author-achievements">
                                        <dl>
                                            <dd>200</dd>
                                            <dt>原创</dt>
                                        </dl>
                                        <dl>
                                            <dd>2K</dd>
                                            <dt>点赞</dt>
                                        </dl>
                                        <dl>
                                            <dd>1W+</dd>
                                            <dt>收藏</dt>
                                        </dl>
                                        <dl>
                                            <dd>3K+</dd>
                                            <dt>粉丝</dt>
                                        </dl>
                                    </n-flex>
                                </div>
                                <div class="profile-intro-operation">
                                    <n-flex justify="center">
                                        <n-button>关注</n-button>
                                    </n-flex>
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                </n-layout-sider>

                <!--博客内容区域-->
                <n-layout-content embeded content-style="padding:20px;">
                    <div style="width: 100%;height: 100%;">
                        <n-layout style="width: 100%;height: 100%;">
                            <n-layout-header style="margin-top:10px">
                                <n-flex justify="center">
                                    <h2>{{ blogInfo.title }}</h2>
                                </n-flex>
                            </n-layout-header>
                            <n-layout-content style="height:calc(85% - 10px - 10px)">
                                <div ref="editorContainer"></div>
                            </n-layout-content>
                        </n-layout>
                    </div>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup>
    import { onMounted,onUnmounted, ref } from 'vue';
    import { BookOpen } from '@vicons/fa';

    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';

    import noteServerRequest from '@/request';
    import noteApi from '@/request/api/noteApi';
    import userApi from '@/request/api/userApi';

    const propsData = defineProps({
        id:{type:String,required:true},//笔记编号
    })
    
    const collapsed = ref(false);
    //是否处于加载中
    const blogContentLoading = ref(true);
    const authorInfoLoading = ref(true);
    //CherryMarkdown 实例
    let cherryInstance = null;
    const editorContainer = ref(null);

    let authorInfo = ref({});
    let blogInfo = ref({});

    async function GetBlogInfo(params) {
        let API = {...noteApi.getNotePublicInfo};
        //请求的URL参数
        API.params = {noteId:propsData.id}
         //发送请求
        await noteServerRequest(API).then(
            responseData=>{
                if(!responseData) return;
                console.log("get blog info:",responseData)
                //笔记的信息
                blogInfo.value.title = responseData.data.title;
                blogInfo.value.update_time = responseData.data.update_time;
                blogInfo.value.content = responseData.data.content;
                authorInfo.value.id = responseData.data.u_id;

                cherryInstance.setValue(blogInfo.value.content);

                //加载已完毕
                blogContentLoading.value = false;
            }
        )
    }

    async function GetAuthorInfo(params) {
        console.log("authorInfo=>",authorInfo);

        let API = {...userApi.getUserPublicInfo};
        //请求的URL参数
        API.params = {UserId:authorInfo.value.id}
        //发送请求
        noteServerRequest(API).then(
            responseData=>{
                if(!responseData) return;
                console.log("get author info:",responseData)
                //笔记的信息
                authorInfo.value.nickName = responseData.data.nickName;
                authorInfo.value.headPic = responseData.data.headPic;
                authorInfo.value.level = responseData.data.level;

                //加载已完毕
                authorInfoLoading.value = false;
            }
        )
    }
    
    onMounted(async ()=>{
        //构造CherryMarkDown实例
        cherryInstance = new Cherry(
            {
                el: editorContainer.value,
                value: blogInfo.value.content,
                editor: {
                    defaultModel: 'previewOnly',
                },
                toolbars: {
                    // 定义顶部工具栏
                    toolbar: [],
                    // 定义侧边栏，默认为空
                    sidebar: [],
                    // 定义顶部右侧工具栏，默认为空
                    toolbarRight: [],
                    // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
                    bubble: false,
                    // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
                    float: false,
                    hiddenToolbar: ['panel', 'justify'],
                },
            }
        );
        
        await GetBlogInfo();
        await GetAuthorInfo();

    })
    onUnmounted(()=>{
        cherryInstance.destroy();
    })

</script>

<style scoped>
    .author {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    dl,dd,dt{
        margin:0;
        padding:0;
    }
    .image,.icon {
        min-width: 60px;
        border-radius: 6px;
    }

    .icon {
        min-width: 60px;
        border-radius: 6px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font:300 23px "";
    }

    .text,.icon {
        transition:all .3s ease;
    }
    .text{
        font: 500 17px "";
        white-space: nowrap;
        opacity: 1;
    }

    .shell{
        padding:10px 14px;
    }

    header {
        position:relative;
    }

    .image-text {
        display: flex;
    }

    .logo-text {
        display: flex;
        flex-direction: column;
    }

    .author-name {
        margin-top: 2px;
        font-size:20px;
    }

    .software {
        font-size: 20px;
        margin-top: -2px;
        display: block;
    }

    .image {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image img {
        width: 45px;
        border-radius: 6px;
    }

    .profile-intro-rank
    {
        margin-top:16px;
        border-radius:2px;
    }

    .profile-intro-rank dl
    {
        text-align: center;
    }

    .author-achievements
    {
        background:#fafafa;
    }

    .profile-intro-operation
    {
        margin-top:16px;
    }
</style>