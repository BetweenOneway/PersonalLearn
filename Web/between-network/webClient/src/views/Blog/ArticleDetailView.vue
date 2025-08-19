<template>
    <n-layout has-sider>
        <n-layout-sider bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false">
            <div class="shell" v-show="!authorInfoLoading">
                <div class="author">
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
        </n-layout-sider>
        <n-layout>
            <div v-show="!blogContentLoading" style="display: flex; flex-wrap: nowrap; padding: 32px 24px 56px 56px;">
                <div style="width: calc(100% - 228px); margin-right: 36px;">
                    <n-scrollbar>
                        <n-card :bordered="false" size="small" style="width: 100%;height: 100%;">
                            <div ref="editorContainer"></div>
                        </n-card>
                    </n-scrollbar>
                </div>
                <!--目录栏-->
                <div style="width: 192px;">
                    <n-scrollbar style="width: 192px; position: sticky; top: 32px; max-height: calc(100vh - 32px - 64px); height: auto;"
                    >
                        <n-anchor
                        affix
                        listen-to=".document-scroll-container"
                        :trigger-top="24"
                        :top="88"
                        style="z-index: 1"
                        :bound="24"
                        >
                            <n-anchor-link title="演示" href="#演示">
                                <n-anchor-link title="基础用法" href="#basic.vue" />
                                <n-anchor-link title="忽略间隔" href="#ignore-gap.vue" />
                                <n-anchor-link title="固定" href="#affix.vue" />
                                <n-anchor-link title="滚动到" href="#scrollto.vue" />
                            </n-anchor-link>
                            <n-anchor-link title="API" href="#API" />
                        </n-anchor>
                    </n-scrollbar>
                </div>
            </div>
        </n-layout>
    </n-layout>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { BookOpen } from '@vicons/fa';

    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';

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

    let authorInfo = {};
    let blogInfo = ref({});

    function GetBlogInfo(params) {
        let API = {...noteApi.getNotePublicInfo};
        //请求的URL参数
        API.params = {noteId:propsData.id}
         //发送请求
         noteServerRequest(API).then(
            responseData=>{
                if(!responseData) return;
                console.log("get blog info:",responseData)
                //笔记的信息
                blogInfo.value.title = responseData.data.title;
                blogInfo.value.update_time = responseData.data.update_time;
                blogInfo.value.content = responseData.data.content;
                authorInfo.value.id = responseData.data.u_id;

                cherryInstance.setValue(note.value.content);

                //加载已完毕
                blogContentLoading.value = false;
            }
        )
    }

    function GetAuthorInfo(params) {
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
    
    onMounted(()=>{
        //构造CherryMarkDown实例
        cherryInstance = new Cherry(
            {
                el: editorContainer.value,
                value: note.value.content,
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
        
        GetBlogInfo();
        GetAuthorInfo();

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