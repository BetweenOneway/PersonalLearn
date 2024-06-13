<template>
    <n-layout embedded content-style="padding:24px">
        <!--小记列表 标头-->
        <n-card size="small" :bordered="false">
            <template #header>
                <h3>便签列表</h3>
            </template>
            <template #header-extra>
                <n-button dashed>新增便签</n-button>
            </template>
        </n-card>
        <!--小记列表 容器-->
        <n-card size="small" :bordered="false" style="margin-top:20px" >
            <!--便签列表骨架屏-->
            <n-space v-if="loading">
                <n-card embeded size="small" :bordered="isDarkTheme" :segmented="{'content':soft}" v-for="n in 9">
                    <template #header>
                        <n-skeleton :width="180" size="small" />
                    </template>
                    <template #header-extra>
                        <n-skeleton repeat="3" :width="20" circle style="margin-left:6px" />
                    </template>
                    <template #default>
                        <n-space>
                            <n-skeleton :width="50" :height="22" />
                            <n-skeleton :width="80" :height="22" />
                            <n-skeleton :width="50" :height="22" />
                        </n-space>
                    </template>
                    <template #footer>
                        <n-skeleton text :width="140" />
                    </template>
                </n-card>
            </n-space>
            <!--便签列表-->
            <n-space v-else-if="!loading && memos.length > 0">
                <meoCard v-for="memo in memos" :key="memo.id" :id="memo.id" :title="memo.title" :finished="!!memo.finished" :top="!!memo.top" :tags="memo.tags.split(',')" :time="memo.update_time" @changeStatus="getMemoList()"></meoCard>
            </n-space>
            <!--暂无便签-->
            <n-empty v-else style="margin:20px auto" size="huge" description="暂无便签">
                <template #icon>
                    <n-icon :component="SubtitlesOffOutlined"></n-icon>
                </template>
                <template #exra>
                    <n-button dashed>创建便签</n-button>
                </template>
            </n-empty>
        </n-card>
    </n-layout>
    
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import {
        SubtitlesOffOutlined
    } from "@vicons/material"
    import { useThemeStore } from "../../stores/themeStore";
    import { getUserToken,loginInvalid } from "../../Utils/userLogin";
    import { noteBaseRequest } from "../../request/noteRequest"
    import {useMessage,useLoadingBar} from 'naive-ui'
    import meoCard from '../../components/memoCard'

    const themeStore = useThemeStore()
    const {isDarkTheme} = storeToRefs(themeStore)

    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    //是否处于加载中
    const loading = ref(true)

    
    //memo列表
    const memos = ref([])

    //获取用户便签列表
    //isUpdateLoading 是否需要改变
    const getMemoList =async ()=>{
        //判断用户登录状态
        const userToken = await getUserToken()
        //发送获取便签请求
        //头部加载进度条开始
        loadingBar.start()
        const {data:responseData} = await noteBaseRequest.get(
                "/memo/getUserMemoList",
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
            console.log(responseData)
            memos.value = responseData.data
            //加载完成 骨架屏不再显示
            loading.value = false
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
    getMemoList()
</script>