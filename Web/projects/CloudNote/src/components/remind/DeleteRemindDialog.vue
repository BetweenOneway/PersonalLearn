<template>
    <n-modal :show="show" preset="dialog" title="删除提醒" 
    type="warning" :closable="false" transform-origin="center"
    @after-leave="reset">
        <template #icon>
            <n-icon style="position:relative;top:-2px" :component="ReportGmailerrorredRound"></n-icon>
        </template>
        <template #default>
            <n-space vertical>
                <!--删除提醒-->
                <n-text v-text="description"></n-text>
                <!--删除文件列表-->
                <n-space v-show="fileArr.length > 1">
                    <n-tag v-for="file in fileArr" :key="file.key" :type="file.theme">
                        {{ file.title }}
                        <template #icon>
                            <n-icon :component="file.icon"></n-icon>
                        </template>
                    </n-tag>
                </n-space>
            </n-space>
        </template>
        <template #action>
            <n-button v-if="deletePer===2 || deletePer === 3" size="small" tertiary type="error" @click="emits('delete',true)">彻底删除</n-button>
            <n-button v-if="deletePer===1 || deletePer===3" size="small" secondary type="error" @click="emits('delete',false)">删除</n-button>
            <n-button size="small" tertiary @click="show=false">取消</n-button>
        </template>
    </n-modal>
</template>

<script setup>
    import {
        EventNoteRound,
        ReportGmailerrorredRound,
        StickyNote2Outlined
    } from "@vicons/material"

    import {useDeleteRemindDialogStore} from '@/stores/deleteRemindDialogStore'
    import { storeToRefs } from "pinia";

    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {
        show,//是否显示提醒框
        fileArr,//删除文件对象数组
        deletePer,//删除权限
        scene,//删除场景
    } = storeToRefs(deleteRemindDialogStore)

    //删除提醒框重置函数
    const {reset} = deleteRemindDialogStore;

    //自定义事件 彻底删除 删除 取消
    const emits = defineEmits(['delete','cancel'])

    //提醒框描述拼接
    const description = computed(()=>{
        const size = fileArr.value.length;
        const permission = deletePer.value;
        let deleteDescription = "";
        if(size.value == 1)
        {
            const fileName = fileArr.value[0].title;
            deleteDescription = deleteDescription.concat(fileArr.value[0].tip,"《",fileName,"》");
        }
        else
        {
            deleteDescription = deleteDescription.concat(size,"个");
        }

        deleteDescription = deleteDescription.concat("文件即将被删除");

        let delDesc = '删除可在回收站中恢复'
        let completeDelDesc = '彻底删除将无法恢复'
        switch(permission)
        {
            case 1:
                deleteDescription = deleteDescription.concat(delDesc);
                break;
            case 2:
                deleteDescription = deleteDescription.concat(completeDelDesc);
                break;
            case 3:
                deleteDescription = deleteDescription.concat(delDesc,',',completeDelDesc);
                break;
            default:
                deleteDescription = deleteDescription.concat('该文件无法被删除');
                break;
        }
        deleteDescription = deleteDescription.concat("。");
        return deleteDescription;
    })
</script>