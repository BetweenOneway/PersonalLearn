<template>
    <n-modal :show="show" preset="dialog" title="删除提醒" 
    type="warning" :closable="false" transform-origin="center">
        <template #icon>
            <n-icon style="position:relative;top:-2px" :component="ReportGmailerrorredRound"></n-icon>
        </template>
        <template #default>{{description}}</template>
        <template #action>
            <n-button v-if="completeDeletBtn" size="small" tertiary type="error" @click="emits('delete',true)">彻底删除</n-button>
            <n-button v-if="deleteBtn" size="small" secondary type="error" @click="emits('delete',false)">删除</n-button>
            <n-button size="small" tertiary @click="show=false">取消</n-button>
        </template>
    </n-modal>
</template>

<script setup>
    import {
        ReportGmailerrorredRound
    } from "@vicons/material"

    import {useDeleteRemindDialogStore} from '@/stores/deleteRemindDialogStore'
    import { storeToRefs } from "pinia";

    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {
        show,//是否显示提醒框
        fileName,//删除单个文件的标题
        size,//删除文件个数
        deleteBtn,//删除按钮是否显示
        completeDeletBtn,//彻底删除按钮是否显示
        type//删除文件类型 1 笔记 2 便签
    } = storeToRefs(deleteRemindDialogStore)

    //自定义事件 彻底删除 删除 取消
    const emits = defineEmits(['delete','cancel'])

    const description = computed(()=>{
        if(size.value == 1)
        {
            if(completeDeletBtn.value)
            {
                return '确认彻底删除('+fileName.value + ')？无法恢复！';
            }
            else
            {
                return '确认删除('+fileName.value + ')？可在回收站中恢复。';
            }
        }
        else
        {
            if(completeDeletBtn.value)
            {
                return '确认彻底删除'+size.value + '个文件？无法恢复！';
            }
            else
            {
                return '确认删除'+size.value + '个文件？可在回收站中恢复。';
            }
        }
    })
</script>