<template>
    <!--便签页-->
    <n-layout embedded content-style="padding:24px">
        <!--小记列表 标头-->
        <n-card size="small" :bordered="false">
            <template #header>
                <h3>便签列表</h3>
            </template>
            <template #header-extra>
                <n-space>
                    <!--搜索输入框-->
                    <n-input-group>
                        <n-input v-model:value="search" placeholder="搜索"></n-input>
                        <n-button @click="getMemoList(false)">搜索</n-button>
                    </n-input-group>
                    <!--过滤选项-->
                    <n-select v-model:value="filter" :options="filterOptions" @update-value="getMemoList(false)" placeholder="过滤" style="width:130px"></n-select>
                    <!--新增便签按钮-->
                    <n-button dashed @click="editMemoModalRef.showEditModal(null)">新增便签</n-button>
                </n-space>
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
                        @delete="showDeleteRemindDialog"
                        @edit="editMemoModalRef.showEditModal(memo.id)"
                        @top="SetMemoTop"></meoCard>
                    </template>
                </TransitionGroup>
            </n-space>
            <!--暂无便签-->
            <n-empty v-if="!loading && memos.length == 0" style="margin:20px auto" size="huge" description="暂无便签">
                <template #icon>
                    <n-icon :component="SubtitlesOffOutlined"></n-icon>
                </template>
                <template #extra>
                    <n-button dashed @click="editMemoModalRef.showEditModal(null)">创建便签</n-button>
                </template>
            </n-empty>
        </n-card>
    </n-layout>

    <!--删除提醒框-->
    <DeleteRemindDialog 
    :show="deleteRemind.show"
    :title="deleteRemind.title"
    @delete="deleteMemo"
    @cancel="deleteRemind.show=false"></DeleteRemindDialog>

    <!--便签编辑-->
    <EditMemoModal ref="editMemoModalRef" @save="getMemoList"/>
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import {
        SubtitlesOffOutlined
    } from "@vicons/material"
    import { useThemeStore } from "../../stores/themeStore";
    import {useUserStore} from '../../stores/userStore'
    import noteServerRequest  from "../../request"
    import memoApi from '../../request/api/memoApi';
    import {useLoadingBar} from 'naive-ui'
    import meoCard from '../../components/memo/memoCard.vue'
    import DeleteRemindDialog from "../../components/remind/DeleteRemindDialog.vue";
    import EditMemoModal from "../../components/memo/EditMemoModal.vue";
    import gsap from "gsap"

    const themeStore = useThemeStore()
    const {isDarkTheme} = storeToRefs(themeStore)

    const userStore = useUserStore();
    const {token,id:user_id} = storeToRefs(userStore);
    watch(
        ()=>token.value,
        newData=>{
            //是否重新进行登录
            if(newData !== null)
            {
                loadingBar.value = true;
                //重新获取用户便签列表
                getMemoList(true,false);
                //判断编辑便签窗口是否需要关闭
                if(editMemoModalRef.value.memoId != null && editMemoModalRef.value.userId !== user_id.value)
                {
                    //关闭编辑便签窗口
                    editMemoModalRef.value.show = false;
                }
            }
        }
    );

    //消息对象
    const loadingBar = useLoadingBar()

    //是否处于加载中
    const loading = ref(true)

    //memo列表
    const memos = ref([])

    //搜索关键字
    const search = ref(null)

    //过滤选项
    const filterOptions = [
        {
            label:'默认',
            value:null
        },
        {
            label:'未完成',
            value:0
        },
        {
            label:'已完成',
            value:1
        }
    ]

    //过滤选项值
    const filter = ref(null)

    //显示便签是否需要延迟动画
    let enterDelay = true;
    //隐藏便签是否需要延迟动画
    let hiddenAnimation = true

    //获取用户便签列表
    /**
     * @param ed {Boolean} 显示便签卡片是否需要延迟动画
     * @param ha {Boolean} 隐藏便签卡片是否需要延迟动画
     */
    const getMemoList =async (ed,ha)=>{
        enterDelay = ed;
        hiddenAnimation = ha;

        let API = {...memoApi.getMemoList};
        API.params={
            searchText:search.value,
            filter:filter.value
        }

        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;

            memos.value = responseData.data
            //加载完成 骨架屏不再显示
            loading.value = false
        })
    }

    //首次进入页面 获取便签列表
    getMemoList(true,false)

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
            delay:()=>{enterDelay ? el.dataset.index * 0.12 : 0},//延迟动画
            onComplete:done//动画执行完成回调函数
        })
    }

    //执行隐藏动画之前的初始位置
    const beforeLeave = (el)=>{
        if(hiddenAnimation)
        {
            //获取删除的元素距离父组件的左和上的位置
            const left = el.offsetLeft
            const top = el.offsetTop
            //设置删除组件的属性（需要脱离文档流）
            gsap.set(el,{
                position:'absolute',
                boxShadow: '0 0 5px black',
                zIndex:1,
                top:top,
                left:left
            })
        }
    }

    //执行隐藏动画
    const leaveEvent = (el,done)=>{
        if(hiddenAnimation)
        {
            let tl = gsap.timeline();//创建时间线动画
            tl.to(el,{
                scale:1.3,
                duration:0.25
            }).to(el,{
                scale:0,
                duration:0.25,
                onComplete:done
            });
        }
        else
        {
            gsap.to(el,{
                duration:0,//秒
                onComplete:done//动画执行完成回调函数
            })
        }
    }

    //删除提醒框的对象
    const deleteRemind = ref({
        show:false,//是否显示
        id:null,//便签编号
        title:""//删除单个文件名称
    })

    //显示删除便签提醒框
    const showDeleteRemindDialog = ({id,title})=>{
        deleteRemind.value.id = id //将要删除的便签编号
        deleteRemind.value.title = title //将要删除的便签标题
        deleteRemind.value.show = true
    }

    //删除便签 
    //complete true彻底删除 false非彻底删除
    const deleteMemo = async (complete)=>{
        //关闭提醒框
        deleteRemind.value.show = false;

        let API = {...memoApi.deleteMemo};
        API.name = complete ? API.name[1]:API.name[0];
        API.params = {
            isCompleteDel:complete,
            memoId:deleteRemind.value.id
        }

        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            getMemoList(false,true);
        })
    }

    /**
     * 置顶或取消置顶便签
     * @param {Boolean} isTop 是否置顶 目标状态
     * @param {Boolean} memoId 便签编号
     * @param btnDisabled 置顶按钮是否被禁用
     */
    const SetMemoTop = async (isTop,memoId,btnDisabled)=>{
        //禁用便签置顶按钮
        disabledBtn(btnDisabled,true);

        let API = {...memoApi.topMemo};
        API.name = isTop ? API.name[0] : API.name[1];
        API.params = {
            targetTop:isTop?1:0,
            memoId:memoId
        }
        await noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            getMemoList(false,false);
        })
        //解除禁用便签置顶按钮
        disabledBtn(btnDisabled,false,true,1);
    }

    //编辑便签模态框引用
    const editMemoModalRef = ref(null)
</script>

<style scoped>
    .move-transition{
        transition:all .5s;
    }
</style>