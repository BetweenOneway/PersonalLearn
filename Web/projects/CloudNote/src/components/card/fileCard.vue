<template>
    <n-card embedded :bordered="isDarkTheme" size="small" hoverable style="cursor:pointer" @click="clickCard()">
        <n-space align="center" :wrap-item="false">
            <!--文件图标-->
            <n-button text type="iconTheme.theme">
                <n-icon :size="32" :component="iconTheme.icon"></n-icon>
            </n-button>
            <!--文件标题和时间-->
            <n-space vertical :size="4">
                <n-text>{{title}}</n-text>
                <n-text depth="3">{{fromNow(time)}}</n-text>
            </n-space>
        </n-space>
    </n-card>
</template>

<script setup>
    import { useThemeStore } from "../../stores/themeStore";
    import { EventNoteRound,StickyNote2Outlined,ShoppingBagOutlined } from '@vicons/material';
    import {fromNow} from '@/utils/dayUtil'
    import { toHerf,showEditMemoWindow } from "../../router/go";
    import {storeToRefs} from 'pinia'

    const themeStore = useThemeStore()
    const {isDarkTheme} = storeToRefs(themeStore)

    //自定义属性
    const props = defineProps(
        {
            id:{required:true,type:Number},
            title:{type:String,default:'未设置文件名'},
            type:{type:Number,required:true},
            time:{type:String,required:true}
        }
    );

    //文件图标主题
    const iconTheme = computed(()=>{
        return props.type === 1 ? {
            theme:'success',
            icon:StickyNote2Outlined
        } : {
            theme:'info',
            icon:EventNoteRound
        };
    });

    //点击文件卡片
    const clickCard = ()=>{
        console.log("props:",props);
        //跳转笔记编辑页面
        if(props.type === 1)
        {
            toHerf('/note/edit/'+props.id);
        }
        else if(props.type ===2)
        {
            //跳转到便签页面
            showEditMemoWindow(props.id);
        }
    }
</script>