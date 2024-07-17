<template>
    <n-modal :show="show" preset="dialog" title="删除提醒" type="warning" closable="false" transform-origin="center">
        <template #icon>
            <n-icon style="position:relative;top:-2px" :component="ReportGmailerrorredRound"></n-icon>
        </template>
        <template #default>{{description}}</template>
        <template #action>
            <n-button v-if="completeDeletBtn" size="small" tertiary type="error" @click="emits('delete',true)">彻底删除</n-button>
            <n-button v-if="deleteBtn" size="small" secondary type="error" @click="emits('delete',false)">删除</n-button>
            <n-button size="small" tertiary @click="emits('cancel','取消')">取消</n-button>
        </template>
    </n-modal>
</template>

<script setup>
    import {
        ReportGmailerrorredRound
    } from "@vicons/material"

    //自定义属性
    defineProps({
        show:{type:Boolean,deafult:false},//是否显示提醒框
        description:{type:String,required:true},//提醒描述
        deleteBtn:{type:Boolean,default:true},//删除按钮是否显示
        completeDeletBtn:{type:Boolean,default:true}//彻底删除按钮是否显示
    })

    //自定义事件 彻底删除 删除 取消
    const emits = defineEmits(['delete','cancel'])
</script>