<template>
    <!--便签页-->
    <n-layout embedded content-style="padding:24px">
        <!--小记列表 标头-->
        <n-card size="small" :bordered="false">
            <template #header>
                <h3>便签列表</h3>
            </template>
            <template #header-extra>
                <n-button dashed @click="editMemoModalRef.showEditModal(null)">新增便签</n-button>
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
            <n-space :wrap-item="false" >
                <TransitionGroup 
                @before-enter="beforeEnter" @enter="enterEvent" 
                @before-leave="beforeLeave" @leave="leaveEvent"
                move-class="move-transition">
                    <template v-if="!loading && memos.length > 0">
                        <meoCard v-for="(memo,index) in memos" :key="memo.id" 
                        :data-index="index"
                        :id="memo.id" 
                        :title="memo.title" 
                        :finished="!!memo.finished" 
                        :top="!!memo.top" 
                        :tags="memo.tags.split(',')" 
                        :time="memo.update_time" 
                        @changeStatus="getMemoList()"
                        @delete="showDeleteRemindDialog"
                        @edit="editMemoModalRef.showEditModal(thing.id)"></meoCard>
                    </template>
                </TransitionGroup>
            </n-space>
            <!--暂无便签-->
            <n-empty v-if="!loading && memos.length == 0" style="margin:20px auto" size="huge" description="暂无便签">
                <template #icon>
                    <n-icon :component="SubtitlesOffOutlined"></n-icon>
                </template>
                <template #exra>
                    <n-button dashed @click="editMemoModalRef.showEditModal(null)">创建便签</n-button>
                </template>
            </n-empty>
        </n-card>
    </n-layout>

    <!--删除提醒框-->
    <DeleteRemindDialog 
    :show="deleteRemind.show"
    :description="deleteRemind.desc"
    @delete="deleteMemo"
    @cancel="deleteRemind.show=false"></DeleteRemindDialog>

    <!--便签编辑-->
    <EditMemoModal ref="editMemoModalRef"/>
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
    import meoCard from '../../components/memo/memoCard.vue'
    import DeleteRemindDialog from "../../components/remind/DeleteRemindDialog.vue";
    import EditMemoModal from "../../components/memo/EditMemoModal.vue";
    import gsap from "gsap"

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

    //执行显示动画之前的初始位置
    const beforeEnter = (el)=>{
        gsap.set(el,{
            y:30,
            opacity:0
        })
    }

    //执行显示动画
    const enterEvent = (el,done)=>{
        gsap.to(el,{
            y:0,//偏移量
            opacity:1,//透明度
            duration:0.5,//秒
            delay:el.dataset.index * 0.12,//延迟动画
            onComplete:done//动画执行完成回调函数
        })
    }

    //执行隐藏动画之前的初始位置
    const beforeLeave = (el)=>{
        gsap.set(el,{
            opacity:1,
            scale:1,
            position:'fixed',
            top:0,
            left:'50%'
        })
    }

    //执行隐藏动画
    const leaveEvent = (el,done)=>{
        gsap.to(el,{
            scale:0.01,
            opacity:0,//透明度
            duration:0.5,//秒
            delay:el.dataset.index * 0.12,//延迟动画
            onComplete:done//动画执行完成回调函数
        })
    }

    //删除提醒框的对象
    const deleteRemind = ref({
        show:false,//是否显示
        id:null,//便签编号
        desc:""//删除描述
    })

    //显示删除便签提醒框
    const showDeleteRemindDialog = ({id,title})=>{
        deleteRemind.value.id = id //将要删除的便签编号
        deleteRemind.value.desc = "删除《"+title+"》,可在回收站恢复。彻底删除无法恢复！" //将要删除的便签标题
        deleteRemind.value.show = true
    }

    //删除便签 
    //complete true彻底删除 false非彻底删除
    const deleteMemo = async (isTop)=>{
        //关闭提醒框
        deleteRemind.value.show = false
        //判断用户登录状态
        const userToken = await getUserToken()
        //发送置顶/取消置顶便签请求
        //头部加载进度条开始
        loadingBar.start()

        const {data:responseData} = await noteBaseRequest.delete(
                "/memo/deleteMemo",
                {
                    params:{
                        isCompleteDel:complete,
                        userToken:userToken,
                        memoId:deleteRemind.value.id
                    }
                }
            ).catch(()=>{
                //加载条异常结束
                loadingBar.error()
                //显示登陆失败的通知
                throw message.error(complete?"彻底删除便签失败":"删除便签失败")
            }
        )

        if(responseData.success)
        {
            loadingBar.finish()
            console.log(responseData)
            message.success(responseData.description)
            //重新获取便签列表
            getMemoList()
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

    //编辑便签模态框引用
    const editMemoModalRef = ref(null)
</script>

<style scoped>
    .move-transition{
        transition:all .5s;
    }
</style>