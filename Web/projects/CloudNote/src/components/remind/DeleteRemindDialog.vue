<template>
    <n-modal v-model:show="show" preset="dialog" title="删除提醒" 
    type="warning" :closable="false" transform-origin="center"
    @after-leave="reset">
        <template #icon>
            <n-icon style="position:relative;top:-2px" :component="ReportGmailerrorredRound"></n-icon>
        </template>
        <template #default>
            <n-space vertical>
                <!--删除提醒-->
                <n-p>
                    <n-text v-text="description"></n-text>
                    <n-button v-show="fileArr.length > 1" text type="success" @click="showDetails= !showDetails">{{showDetails?"收起详情":"查看详情"}}</n-button>
                </n-p>
                <div v-show="showDetails && fileArr.length > 1">
                    <n-divider style="margin:0 0 14px" />
                    <!--删除文件列表-->
                    <n-scrollbar style="max-height: 260px;" trigger="none">
                        <n-space>
                            <n-tag closable :bordered="false" 
                            v-for="file in fileArr" :key="file.key" :type="file.theme"
                            @close="closeFileTag(file.key)">
                                {{ file.title }}
                                <template #icon>
                                    <n-icon :component="file.icon"></n-icon>
                                </template>
                            </n-tag>
                        </n-space>
                    </n-scrollbar>
                </div>
            </n-space>
        </template>
        <template #action>
            <n-button v-if="deletePer===2 || deletePer === 3" size="small" 
            tertiary type="error" @click="delteFile(true)">彻底删除</n-button>
            <n-button v-if="deletePer===1 || deletePer===3" size="small" 
            secondary type="error" @click="delteFile(false)">删除</n-button>
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
    import { useMessage } from "naive-ui";

    import noteServerRequest  from "../../request"
    import fileApi from '../../request/api/fileApi';

    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {
        show,//是否显示提醒框
        showDetails,//是否显示详情
        files,//删除的文件对象数组
        fileArr,//删除文件对象数组 files每一项多加了点属性
        deletePer,//删除权限
    } = storeToRefs(deleteRemindDialogStore);

    //删除提醒框重置函数
    const {reset} = deleteRemindDialogStore;

    //自定义事件 彻底删除 删除 取消
    const emits = defineEmits(['remove'])

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

        deleteDescription = deleteDescription.concat("文件即将被删除。");

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
                deleteDescription = deleteDescription.concat(delDesc,'，',completeDelDesc);
                break;
            default:
                deleteDescription = deleteDescription.concat('该文件无法被删除');
                break;
        }
        deleteDescription = deleteDescription.concat("。");
        return deleteDescription;
    })

    //消息对象
    const message = useMessage();
    //
    const delteFile = async isComplete=>{

        show.value = false;

        const toDeleteFiles = fileArr.value;
        if(toDeleteFiles.length === 0)
        {
            throw message.error("未选中任何文件");
            return;
        }

        let API = {...fileApi.deleteFile}
        if(toDeleteFiles.length === 1)
        {
            //单文件删除
            API.name = isComplete?API.name[1]:API.name[0];
        }
        else{
            //多文件删除
            API.name = isComplete?API.name[3]:API.name[2];
        }
        API.params = {
            complete:isComplete,
            files:toDeleteFiles
        }

        console.log("start delte file,API",API)
        noteServerRequest(API).then(responseData=>{
            console.log("responseData",responseData);
            if(!responseData) return;
            emits('deleteSuccess');
        })
    }

    //点击待移除文件关闭标签
    const closeFileTag = (key)=>{
        files.value = files.value.filter(item=>item.key !== key);
        //通知父组件移除某个文件
        emits('remove',key);
    }
</script>