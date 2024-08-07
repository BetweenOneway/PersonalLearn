<template>
    <!--笔记页面容器-->
    <n-layout has-sider>
        <!--笔记列表容器-->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="0"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        class = "note-list"
      >
        <!--标题区 新增笔记按钮-->
        <n-card>
            <template #action>
                <n-space align="center" justify="space-between">
                    <h3 style="margin:0">笔记列表</h3>
                    <n-button circle type="primary">
                        <n-icon :component="PlusRound" :size="22px"></n-icon>
                    </n-button>
                </n-space>
            </template>
        </n-card>
        <!--笔记列表-->
        <n-list hoverable clickable style="margin:5px">
            <n-list-item>
                <NoteCard id="1" desc="desc" time="20240901 12:00:00" title="title"></NoteCard>
            </n-list-item>
        </n-list>
      </n-layout-sider>
    </n-layout>
</template>

<script setup>
    import {ref} from 'vue'
    import {PlusRound} from'@vicons/material'
    import {NoteCard} from '@/components/note/NoteCard.vue'

    //笔记列表容器是否被收缩
    const collapsed = ref(false)
</script>

<style>
/*只有将笔记列表容器收起来时，切换按钮的位置才会向右偏移*/
.n-layout-sider.n-layout-sider--collapsed.note-list .n-layout-toggle-button {
    right: -30px;
}

.n-layout-sider.note-list .n-layout-toggle-button {
    transition: right 1s;
}
</style>