<template>
    <!--骨架屏-->
    <n-space vertical :wrap-item="false" v-if="loading">
        <n-skeleton :height="36" width="100%"></n-skeleton>
        <n-skeleton text width="30%"></n-skeleton>
        <n-skeleton text width="60%"></n-skeleton>
        <n-skeleton text width="40%"></n-skeleton>
        <n-skeleton text width="80%"></n-skeleton>
    </n-space>
    <n-space vertical v-else>
        <!--发布时间 分享 更多操作-->
        <n-card size="small">
            <n-grid x-gap="20" cols="12" item-responsive responsive="screen">
                <n-gi span="0 m:10 l:10">
                    <n-input v-model:value="note.title" size="large" placeholder="笔记标题" 
                    style="--n-border:none;background-color: transparent"></n-input>
                </n-gi>
                <n-gi span="0 m:2 l:2">
                    <n-space justify="space-between" align="center">
                        <n-button type="primary" @click="saveNote()">
                            保存
                        </n-button>
                        <n-button type="primary" @click="deleteNote()">
                            删除
                        </n-button>
                        <n-button quaternary circle>
                            <n-icon size="20" :component="MoreHorizRound"/>
                        </n-button>
                    </n-space>
                </n-gi>
            </n-grid>
        </n-card>

        <!--富文本编辑器-->
        <n-card :bordered="false" size="small">
            <!--富文本编辑器-->
            <Ckeditor
            :editor="EditorType" 
            @ready="editorReady" 
            v-model="note.content"
            :config="getEditorConfigs()"/>
        </n-card>

        <!--底部状态栏-->
        <n-card :bordered="false" size="small">
            <n-space justify-content="space-between" align="center">
                <!--发布时间-->
                <n-space color="#18A058" align="center" :wrap-item="false">
                    <n-icon :component="FiberManualRecordRound"></n-icon>
                    <n-text depth="3">保存并发布于:{{ note.update_time }}</n-text>
                </n-space>
            </n-space>
        </n-card>
    </n-space>

     <!--删除提醒框-->
     <DeleteRemindDialog @deleteSuccess="$emit('deleteSuccess')"></DeleteRemindDialog>
    
</template>

<script setup>
    import { inject } from 'vue';
    import { Ckeditor } from '@ckeditor/ckeditor5-vue';
    import {EditorType,getEditorConfigs} from "@/editor"
    import noteServerRequest from '../../request';
    import noteApi from '../../request/api/noteApi';
    import {useMessage} from 'naive-ui'
    import {FiberManualRecordRound,
        MoreHorizRound
    } from'@vicons/material'
    import 'ckeditor5/ckeditor5.css';
    import { toHerf } from "../../router/go"

    import {useDeleteRemindDialogStore} from '../../stores/deleteRemindDialogStore'
    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {DefaultDeleteRemind} = deleteRemindDialogStore;

    //自定义事件
    const emits = defineEmits(['save','deleteSuccess']);
    //消息对象
    const message = useMessage()

    //const ckeditor5 = CKEditor.component;

    const propsData = defineProps({
        id:{type:String,required:true},
        changeState:{type:Number},
        actionId:{type:Number}
    })

    //当前正在编辑笔记所属的用户编号
    const editNoteUID = inject("editNoteUID")

    watch(
        ()=>propsData.changeState,
        newData=>{
            if(propsData.actionId == Number.parseInt(propsData.id))
            {
                switch(newData)
                {
                    case 1:
                        //重新获取编辑的笔记
                        getNoteInfo();
                        break;
                    case 2:
                        //路由跳转到笔记首页
                        toHerf('/note');
                        break;
                }
            }
        }
    )

    //是否处于加载中
    const loading = ref(true);

    //笔记信息
    const note = ref({})
    /**
     * 获取编辑笔记信息
     */
     const getNoteInfo = async ()=>{
        //加载中
        loading.value = true;

        let API = {...noteApi.getNoteInfo};
        //请求的URL参数
        API.params = {noteId:propsData.id}

        //发送请求
        noteServerRequest(API).then(
            responseData=>{
                if(!responseData) return;
                console.log("get note info:",responseData)
                //笔记的信息
                note.value = responseData.data;
                //编辑笔记的用户编号
                editNoteUID.value = note.value.u_id;
                //加载已完毕
                loading.value = false;
            }
        )
    }

    //如果笔记编号发生改变 重新获取指定笔记信息
    watch(
        ()=>propsData.id,
        ()=>{
            getNoteInfo();
        }
    )
    //获取选定笔记信息
    getNoteInfo();

    //编辑器对象
    let editor = null;
    /**
     * 编辑器加载完成处理函数
     */
    const editorReady = (editorObj)=>{
        //保存编辑器对象
        editor = editorObj;
        // 在编辑器区域插入工具栏
        editorObj.ui.getEditableElement().parentElement.insertBefore(
            editorObj.ui.view.toolbar.element,
            editorObj.ui.getEditableElement()
        );
    }

    //快捷键Ctrl+s保存笔记
    onMounted(()=>{
        window.addEventListener('keydown',(e)=>{
            //console.log(e);
            //ctrl+s
            if(e.keycode === 83 && e.ctrlkey === true)
            {
                e.preventDefault();
                e.returnValue = false;
                //保存笔记
                saveNote();
            }
        })
    })

    /**
     * 保存笔记
     */
    const saveNote = async ()=>{
        //编号
        const noteId = propsData.id;
        //标题
        const title = note.value.title;
        //笔记主体内容(不含标题)
        //const body = note.value.content;//editor.plugins.get('Title').getBody();
        //笔记主体内容（不含标题）
        const content = note.value.content;

        //表单
        let formData = new FormData();
        formData.append("noteId",noteId)
        formData.append("title",title)
        //formData.append("body",body)
        formData.append("content",content)

        let API = {...noteApi.saveNote}
        API.data = formData;
        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;

            //更新笔记最后一次操作时间
            note.value.update_time = responseData.data.update_time;
            //告诉父组件重新获取列表
            emits('save');
        })
    }

    /**
     * 删除笔记
     */
    const deleteNote = async()=>{
        //编号
        const noteId = propsData.id;
        //标题
        const title = note.value.title;

        let noteInfo = {
            id:noteId,
            title:title,
            type:1,
        };
        DefaultDeleteRemind(noteInfo);
    }

</script>

<style>
    /*
    隐藏powered by ckeditor logo
    */
    .ck.ck-balloon-panel.ck-balloon-panel_visible.ck-powered-by-ballon{
        display:none;
    }

    /*编辑器为选中时的边框*/
    .ck.ck-editor__editable_inline{
        border:none;
    }

    /*去除编辑器聚焦时边框*/
    .ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable){
        border:none;
        box-shadow: none;
    }

    
</style>