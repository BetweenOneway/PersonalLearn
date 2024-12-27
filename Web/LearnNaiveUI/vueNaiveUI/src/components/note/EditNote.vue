<template>
    <!--骨架屏-->
    <n-space vertical :wrap-item="false" v-if="loading">
        <n-skeleton :height="36" width="100%"></n-skeleton>
        <n-skeleton text width="30%"></n-skeleton>
        <n-skeleton text width="60%"></n-skeleton>
        <n-skeleton text width="40%"></n-skeleton>
        <n-skeleton text width="80%"></n-skeleton>
    </n-space>
    <n-space vertical v-else>
        <!--发布时间 分享 更多操作-->
        <n-card size="small">
            <n-grid x-gap="20" cols="12" item-responsive responsive="screen">
                <n-gi span="0 m:10 l:10">
                    <n-input v-model:value="note.title" size="large" placeholder="笔记标题" 
                    style="--n-border:none;background-color: transparent"></n-input>
                </n-gi>
                <n-gi span="0 m:2 l:2">
                    <n-space justify="space-between" align="center">
                        <n-button type="primary" @click="saveNote()">
                            保存
                        </n-button>
                        <n-button type="primary" @click="deleteNote()">
                            删除
                        </n-button>
                        <n-button quaternary circle>
                            <n-icon size="20" :component="MoreHorizRound"/>
                        </n-button>
                    </n-space>
                </n-gi>
            </n-grid>
        </n-card>

        <!--富文本编辑器-->
        <n-card :bordered="false" size="small">
            <!--编辑器-->
        </n-card>

        <!--底部状态栏-->
        <n-card :bordered="false" size="small">
            <n-space justify-content="space-between" align="center">
                <!--发布时间-->
                <n-space color="#18A058" align="center" :wrap-item="false">
                    <n-icon :component="FiberManualRecordRound"></n-icon>
                    <n-text depth="3">保存并发布于:{{ note.update_time }}</n-text>
                </n-space>
            </n-space>
        </n-card>
    </n-space>
    
</template>

<script setup>
    import {FiberManualRecordRound,
        MoreHorizRound
    } from'@vicons/material'

    //笔记信息
    const note = ref({})
</script>