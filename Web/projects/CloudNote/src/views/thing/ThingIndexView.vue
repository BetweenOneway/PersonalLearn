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
            <n-space>
                <n-card :segmented="{'content':soft}" 
                :class="{'thing-card-finished' : memo.finished}" size="small" 
                v-for="memo in memos" :key="memo.id"
                :bordered="isDarkTheme" style="min-width:220px"
                :embedded :title="memo.title">
                    <template #header-extra>
                        <!--删除按钮-->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left:16px">
                                    <n-icon :size="18" :component="DeleteOutlineRound"></n-icon>
                                </n-button>
                            </template>
                            删除
                        </n-popover>
                        
                        <!--置顶按钮-->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left:8px">
                                    <n-icon :size="18" :component="memoCardTopIconText(memo.top).icon"></n-icon>
                                </n-button>
                            </template>
                            {{ memoCardTopIconText(memo.top).text }}
                        </n-popover>

                        <!--编辑按钮-->
                        <n-popover>
                            <template #trigger>
                                <n-button text style="margin-left:8px">
                                    <n-icon :size="18" :component="EditNoteRound"></n-icon>
                                </n-button>
                            </template>
                            编辑
                        </n-popover>
                    </template>
                    <!--便签标签-->
                    <template #default>
                        <n-space>
                            <n-tag v-for="tag in memo.tags.split(',')" :key="tag" size="small">{{tag}}</n-tag>
                        </n-space>
                    </template>
                    <!--底部状态栏-->
                    <template #footer>
                        <n-space align="center" :size="3">
                            <n-tag v-if="memo.top" size="small" type="success">置顶</n-tag>
                            <n-divider vertical></n-divider>
                            <n-text depth="3">{{memo.update_time}}</n-text>
                        </n-space>
                    </template>
                </n-card>
            </n-space>
        </n-card>
    </n-layout>
    
</template>

<style scoped>
    .thing-card-finished::after {
        position:absolute;
        content:"";
        width:100px;
        height:100px;
        bottom:50%;
        left:40px;
        transform: translateY(50px);
        background-image: url("@/assets/finish.png");
        background-size:100px 100px;
        background-repeat:no-repeat;
        filter:drop-shadow(5px 5px 2px v-bind(thingFinishedShadowColor));/*仅对像素阴影*/
    }
</style>

<script setup>
    import { computed } from "vue";
    import { storeToRefs } from "pinia";
    import { DeleteOutlineRound, ArrowCircleUpRound, ArrowCircleDownRound, EditNoteRound} from "@vicons/material"
    import { useThemeStore } from "../../stores/themeStore";
    import { getUserToken,loginInvalid } from "../../Utils/userLogin";
    import { noteBaseRequest } from "../../request/noteRequest"
    import {useMessage,useLoadingBar} from 'naive-ui'

    const themeStore = useThemeStore()
    const {isDarkTheme} = storeToRefs(themeStore)

    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    //便签已完成图片影子的颜色
    const thingFinishedShadowColor = computed(()=>{
        return isDarkTheme ?"#ABBAAA":"#676767";
    })

    /*
    便签置顶对象
    top true 置顶；false 不置顶
    */
    const memoCardTopIconText=(top)=>{
        if(top)
        {
            return {
                icon:ArrowCircleDownRound,
                text:'取消置顶'
            }
        }
        else
        {
            return {
                icon:ArrowCircleUpRound,
                text:'置顶'
            }
        }
    }
    //memo列表
    const memos = ref([])

    //获取用户便签列表
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