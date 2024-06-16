<template>
    <n-card :segmented="{'content':soft}" 
                :class="{'thing-card-finished' : finished}" size="small" 
                :bordered="isDarkTheme" style="min-width:220px;max-width:max-content"
                :embedded :title="title">
        <template #header-extra>
            <!--删除按钮-->
            <n-popover>
                <template #trigger>
                    <n-button text style="margin-left:16px" @click="emits('delete',{id,title})">
                        <n-icon :size="18" :component="DeleteOutlineRound"></n-icon>
                    </n-button>
                </template>
                删除
            </n-popover>
            
            <!--置顶按钮-->
            <n-popover>
                <template #trigger>
                    <!--memo.top 0 非置顶 1 置顶-->
                    <n-button :disabled="topBtnDisabled" text style="margin-left:8px" @click="SetMemoTop(!top)">
                        <n-icon :size="18" :component="memoCardTopIconText.icon"></n-icon>
                    </n-button>
                </template>
                {{ memoCardTopIconText.text }}
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
                <n-tag v-for="tag in tags" size="small">{{tag}}</n-tag>
            </n-space>
        </template>
        <!--底部状态栏-->
        <template #footer>
            <n-space align="center" :size="3">
                <n-tag v-if="top" size="small" type="success">置顶</n-tag>
                <n-divider vertical></n-divider>
                <n-text depth="3">{{time}}</n-text>
            </n-space>
        </template>
    </n-card>
</template>

<script setup>
    import { computed,ref } from "vue";
    import { storeToRefs } from "pinia";
    import { useThemeStore } from "../../stores/themeStore";

    import { 
        DeleteOutlineRound, 
        ArrowCircleUpRound, 
        ArrowCircleDownRound, 
        EditNoteRound
    } from "@vicons/material"

    import { getUserToken,loginInvalid } from "../../Utils/userLogin"
    import { noteBaseRequest } from "../../request/noteRequest"
    import {useMessage,useLoadingBar} from 'naive-ui'

    const themeStore = useThemeStore()
    const {isDarkTheme} = storeToRefs(themeStore)

    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    //自定义属性
    const propsData = defineProps({
        id:{type:Number,required:true},//便签编号
        finished:{type:Boolean,default:false},//便签是否已完成
        title:{type:String,required:true},//标题
        top:{type:Boolean,default:false},//是否置顶
        tags:{type:Array,default:['暂无标签']},//标签
        time:{type:String,required:true}//便签最后更新时间
    })
    
    //自定义事件
    const emits = defineEmits(['changeStatus','delete'])

    //便签已完成图片影子的颜色
    const thingFinishedShadowColor = computed(()=>{
        return isDarkTheme ?"#ABBAAA":"#676767";
    })

    //置顶按钮是否被禁用
    const topBtnDisabled = ref(false);

    /*
    便签置顶对象
    top true 置顶；false 不置顶
    */
    const memoCardTopIconText=computed(()=>{
        if(propsData.top)
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
    })

    //置顶或取消置顶便签
    //isTop bool 是否置顶 目标状态
    const SetMemoTop = async (isTop)=>{
        
        //判断用户登录状态
        const userToken = await getUserToken()
        //发送置顶/取消置顶便签请求
        //头部加载进度条开始
        loadingBar.start()

        //禁用便签置顶按钮
        topBtnDisabled.value = true

        const {data:responseData} = await noteBaseRequest.get(
                "/memo/setMemoTop",
                {
                    params:{
                        userToken:userToken,
                        targetTop:isTop?1:0,
                        memoId:propsData.id
                    }
                }
            ).catch(()=>{
                //加载条异常结束
                loadingBar.error()
                topBtnDisabled.value = false//解除禁用便签置顶按钮
                //显示登陆失败的通知
                throw message.error(isTop?"置顶便签失败":"取消置顶便签失败")
            }
        )

        topBtnDisabled.value = false//解除禁用便签置顶按钮
        if(responseData.success)
        {
            loadingBar.finish()
            console.log(responseData)
            message.success(responseData.description)
            //通知父组件重新获取便签列表
            emits('changeStatus')
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
</script>

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