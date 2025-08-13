<template>
    <n-layout has-sider>
        <n-layout-sider bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false">
            <div class="shell">
                <header>
                    <div class="image-text">
                        <span class="image">
                            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="">
                        </span>
                        <div class="text logo-text">
                            <span class="name">王者伟业</span>
                            <span class="software">Admin</span>
                        </div>
                    </div>
                </header>
                <div class="profile-intro-rank">
                    <n-flex>
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
                <div></div>
            </div>
        </n-layout-sider>
        <n-layout>
            <div style="display: flex; flex-wrap: nowrap; padding: 32px 24px 56px 56px;">
                <div style="width: calc(100% - 228px); margin-right: 36px;">
                    <n-scrollbar>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
                    <h1>文章内容</h1>
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
    import { ref } from 'vue';

    const propsData = defineProps({
        id:{type:String,required:true},
    })
    
    let authorInfo = {};
    const collapsed = ref(false)
</script>

<style scoped>
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

    .name {
        margin-top: 2px;
        font:600 18px;
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

    .profile-intro-operation
    {
        margin-top:16px;
    }
</style>