<template>
    <n-layout has-sider>
        <n-layout-sider bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false">
            博客作者信息
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
    console.log("propsData.id=>",propsData.id);
    const collapsed = ref(false)
</script>