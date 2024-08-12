<template>
    <!--笔记页面容器-->
    <n-layout has-sider>
        <!--笔记列表容器-->
      <n-layout-sider
        bordered
        show-trigger
        :collapsed-width="0"
        :width="340"
        class = "note-list"
      >
        <n-scrollbar>
            <!--标题区 新增笔记按钮-->
            <n-card :bordered="false" style="position:sticky;top:0;z-index:1">
                <template #action>
                    <n-space align="center" justify="space-between">
                        <h3 style="margin:0">笔记列表</h3>
                        <n-button circle type="primary">
                            <n-icon :component="PlusRound" :size="22"></n-icon>
                        </n-button>
                    </n-space>
                </template>
            </n-card>
            <!--笔记列表骨架屏-->
            <n-space v-if="loading" vertical style="margin:12px">
                <n-card size="small" v-for="n in 3" :key="n">
                    <n-space vertical>
                        <n-skeleton :height="26" :width="120"></n-skeleton>
                        <n-skeleton text :repeat="2"></n-skeleton>
                        <n-skeleton :height="23" :width="200"></n-skeleton>
                    </n-space>
                </n-card>
            </n-space>
            <!--笔记列表-->
            <n-list v-else-if="noteList.length > 0" hoverable clickable style="margin:12px">
                <n-list-item v-for="note in noteList" :key="note.id">
                    <NoteCard :id="note.id" :title="note.title" :desc="note.body" :top="!!note.top" :time="note.update_time"></NoteCard>
                </n-list-item>
            </n-list>
             <!--暂无笔记-->
             <n-empty v-else style="width:max-content;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)" size="huge" description="暂无笔记列表">
                <template #icon>
                    <n-icon :component="SubtitlesOffOutlined"></n-icon>
                </template>
                <template #extra>
                    <n-button dashed>创建笔记</n-button>
                </template>
            </n-empty>
        </n-scrollbar>
      </n-layout-sider>
    </n-layout>
</template>

<script setup>
    import {ref} from 'vue'
    import {PlusRound,SubtitlesOffOutlined} from'@vicons/material'
    import NoteCard from '@/components/note/NoteCard.vue'
    import { getUserToken,loginInvalid } from "../../Utils/userLogin";
    import { noteBaseRequest } from "../../request/noteRequest"
    import {useMessage,useLoadingBar} from 'naive-ui'

    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    //是否处于加载状态
    const loading = ref(true)

    //笔记列表
    const noteList = ref([]);

    //获取用户笔记列表
     const getNoteList =async ()=>{
        //判断用户登录状态
        const userToken = await getUserToken()
        //发送获取便签请求
        //头部加载进度条开始
        loadingBar.start();

        const {data:responseData} = await noteBaseRequest.get(
                "/note/getUserNoteList",
                {
                    params:{
                        userToken
                    }
                }
            ).catch(()=>{
                //加载条异常结束
                loadingBar.error()
                //显示登陆失败的通知
                throw message.error(responseData.description)
            }
        )

        if(responseData.success)
        {
            loadingBar.finish()
            //封装笔记列表
            noteList.value = responseData.data;
            //停止显示骨架屏
            loading.value = false;
        }
        else
        {
            loadingBar.error()
            message.error(responseData.description)
            //登录失效处理
            if(responseData.status ==='SERVICE_008')
            {
                loginInvalid(true)
            }
        }
    }

    getNoteList();
</script>

<style>
/*只有将笔记列表容器收起来时，切换按钮的位置才会向右偏移*/
.n-layout-sider.n-layout-sider--collapsed.note-list .n-layout-toggle-button {
    right: -30px;
}

.n-layout-sider.note-list .n-layout-toggle-button {
    transition: right 2s;
}
</style>