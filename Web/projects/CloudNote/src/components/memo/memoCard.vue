<template>
    <n-card :segmented="{'content':'soft'}" 
            :class="{'thing-card-finished' : finished}" size="small" 
            :bordered="isDarkTheme" style="min-width:220px;max-width:max-content"
            :embedded="isDarkTheme" :title="title" hoverable>
        <template #header-extra>
            <!--删除按钮-->
            <n-popover>
                <template #trigger>
                    <n-button text style="margin-left:16px" @click.stop="emits('delete',{id,title})">
                        <n-icon :size="18" :component="DeleteOutlineRound"></n-icon>
                    </n-button>
                </template>
                删除
            </n-popover>
            
            <!--置顶按钮-->
            <n-popover>
                <template #trigger>
                    <!--memo.top 0 非置顶 1 置顶-->
                    <n-button :disabled="topBtnDisabled" text style="margin-left:8px" @click.stop="clickTopBtn">
                        <n-icon :size="18" :component="memoCardTopIconText.icon"></n-icon>
                    </n-button>
                </template>
                {{ memoCardTopIconText.text }}
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

    const themeStore = useThemeStore()
    const {isDarkTheme} = storeToRefs(themeStore)

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
    const emits = defineEmits(['delete','top'])

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

    //点击置顶按钮
    const clickTopBtn = ()=>{
        emits('top',!propsData.top,propsData.id,topBtnDisabled)
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