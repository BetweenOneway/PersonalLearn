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
                    文章内容
                </div>
                <div style="width: 192px;">
                    目录结构
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