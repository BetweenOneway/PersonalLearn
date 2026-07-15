<template>
    <div style="position:relative;width: 100%;height: 100%;">
        <!--骨架屏-->
        <n-space v-show="loading" vertical :wrap-item="false" >
            <n-skeleton :height="36" width="100%"></n-skeleton>
            <n-skeleton text width="30%"></n-skeleton>
            <n-skeleton text width="60%"></n-skeleton>
            <n-skeleton text width="40%"></n-skeleton>
            <n-skeleton text width="80%"></n-skeleton>
        </n-space>
        <div v-show="!loading" style="width: 100%;height: 100%;display: flex;flex-direction: column;">
            <header class="note-header">
                <n-input v-if="isEditing" v-model:value="note.title" size="medium" placeholder="笔记标题" 
                class="note-title-input"></n-input>
                <h3 v-else class="note-title">{{ note.title }}</h3>
                <div class="note-actions">
                    <n-button v-if="!isEditing" size="small" @click="enterEditMode">
                        编辑
                    </n-button>
                    <n-button v-else type="primary" size="small" @click="saveNote">
                        保存
                    </n-button>
                    <n-button text size="small" class="delete-btn" :focusable="false" @click="deleteNote">
                        <template #icon>
                            <n-icon size="16" :component="DeleteOutlined"/>
                        </template>
                        删除
                    </n-button>
                </div>
            </header>
            <main class="note-main">
                <div v-if="useCkEditor" class="editor-wrapper">
                    <Ckeditor
                    :editor="EditorType" 
                    @ready="editorReady" 
                    v-model="note.content"
                    :config="getEditorConfigs()"/>
                </div>
                <div v-else class="editor-wrapper" ref="editorContainer"></div>
            </main>
            <footer class="status-bar">
                <span class="status-bar__item">
                    <span class="status-bar__dot"></span>
                    更新于:{{ note.update_time }}
                </span>
                <n-button
                    v-if="note.status == 2"
                    text
                    size="tiny"
                    class="status-bar__btn"
                    @click="PublicNote(false)"
                >
                    <template #icon>
                        <n-icon size="14" :component="PublicOffFilled"/>
                    </template>
                    已公开笔记
                </n-button>
                <n-button
                    v-else
                    text
                    size="tiny"
                    class="status-bar__btn"
                    @click="PublicNote(true)"
                >
                    <template #icon>
                        <n-icon size="14" :component="PublicFilled"/>
                    </template>
                    未公开笔记
                </n-button>
            </footer>
        </div>
    </div>
    
    <!--删除提醒框-->
    <DeleteRemindDialog @deleteSuccess="deleteNoteSuccess"></DeleteRemindDialog>
</template>

<script setup>
    import { ref,inject,watch,onMounted,onUnmounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { Ckeditor } from '@ckeditor/ckeditor5-vue';
    import {EditorType,getEditorConfigs} from "@/ckEditor"
    import 'ckeditor5/ckeditor5.css';
    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';

    import {DeleteOutlined,
        PublicFilled,
        PublicOffFilled
    } from'@vicons/material'
    
    import { toHerf } from "@/router/go"

    import noteServerRequest from '@/request';
    import noteApi from '@/request/api/noteApi';

    import DeleteRemindDialog from "@/components/remind/DeleteRemindDialog.vue";
    import {useDeleteRemindDialogStore} from '@/stores/deleteRemindDialogStore'
    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {DefaultDeleteRemind} = deleteRemindDialogStore;

    //是否使用CkEditor
    let useCkEditor = ref(false);

    const isEditing = ref(false);
    const editorContainer = ref(null);
    //自定义事件
    const emits = defineEmits(['save','deleteSuccess']);

    //CherryMarkdown 实例
    let cherryInstance = null;

    //const ckeditor5 = CKEditor.component;

    const route = useRoute();

    const propsData = defineProps({
        id:{type:String,required:true},
        changeState:{type:Number},
        actionId:{type:Number},//上下文菜单ID
        isRecycleBinNote:{type:Boolean,default:false}
    })

    //当前正在编辑笔记所属的用户编号
    const editNoteUID = inject("editNoteUID")

    watch(
        ()=>propsData.changeState,
        newData=>{
            console.log("propsData.actionId=>",propsData.actionId);
            console.log("Number.parseInt(propsData.id)=>",Number.parseInt(propsData.id));
            //if(propsData.actionId == Number.parseInt(propsData.id))
            {
                console.log("new Data=>",newData);
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
                cherryInstance.setValue(note.value.content);
                //编辑笔记的用户编号
                editNoteUID.value = note.value.u_id;
                //新笔记自动进入编辑模式，否则退出到预览模式
                if(route.query.new === 'true')
                {
                    enterEditMode();
                }
                else
                {
                    exitEditMode();
                }
                //加载已完毕
                loading.value = false;
            }
        )
    }

    //如果笔记编号发生改变 重新获取指定笔记信息
    watch(
        ()=>propsData.id,
        ()=>{
            isEditing.value = false;
            getNoteInfo();
        }
    )

    //编辑器对象
    let ckEditor = null;
    /**
     * 编辑器加载完成处理函数
     */
    const editorReady = (editorObj)=>{
        //保存编辑器对象
        ckEditor = editorObj;
        // 在编辑器区域插入工具栏
        editorObj.ui.getEditableElement().parentElement.insertBefore(
            editorObj.ui.view.toolbar.element,
            editorObj.ui.getEditableElement()
        );
    }

    onMounted(()=>{
        //快捷键Ctrl+s保存笔记
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

        //这里获取不到 是个null
        // alert(editorContainer.value);
        //console.log("editorContainer.value",editorContainer.value);
    
        if(!useCkEditor.value)
        {
            cherryInstance = new Cherry(
                {
                    el: editorContainer.value,
                    value: note.value.content,
                    engine: {
                        syntax: {
                            table: {
                                enableChart: false,
                            },
                        },
                    },
                    editor: {
                        defaultModel: 'previewOnly',
                    },
                    toolbars: {
                        // 定义顶部工具栏
                        toolbar: ['bold','italic','strikethrough','|','color','header','|','list'],
                        // 定义侧边栏，默认为空
                        sidebar: [],
                        // 定义顶部右侧工具栏，默认为空
                        toolbarRight: [],
                        // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
                        bubble: false,
                        // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
                        float: false,
                        hiddenToolbar: ['panel', 'justify'],
                    },
                }
            );
        }
    });
    
    onUnmounted(()=>{
        cherryInstance.destroy();
    })

    function enterEditMode()
    {
        isEditing.value = true;
        if (!useCkEditor.value) {
            cherryInstance.switchModel('edit&preview');
        }
    }

    function exitEditMode()
    {
        isEditing.value = false;
        if (!useCkEditor.value) {
            cherryInstance.switchModel('previewOnly');
        }
    }

    /**
     * 保存笔记
     */
    const saveNote = async ()=>{
        //编号
        const noteId = propsData.id;
        //标题
        const title = note.value.title;
        //笔记主体内容(不含标题)
        //const body = note.value.content;//ckEditor.plugins.get('Title').getBody();
        
        //笔记主体内容（不含标题） 获取编辑器内容
        if(!useCkEditor.value)
        {
            let noteContent = cherryInstance.getValue();
            note.value.content = noteContent;//JSON.stringify({ noteContent });
            console.log("get CherryMarkDown内容=>",note.value.content);
        }
        
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
            emits('save', {
                id: noteId,
                title,
                content,
                update_time: responseData.data.update_time
            });
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

        //emits("deleteSuccess");
    }

    function deleteNoteSuccess(){
        console.log("=============Edit note delete note success============");
        emits("deleteSuccess");
    }
    /**
     * 公开笔记
    */
    function PublicNote(isPublic)
    {
        let API = {...noteApi.publicNote};
        API.name = isPublic ? API.name[0]:API.name[1];
        //请求URL的参数
        API.params= {
            targetOpenStatus:isPublic?2:1,
            noteId:propsData.id
        };

        //发送请求
        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                note.value.status = isPublic?2:1;
            }
        })
    }

    //获取选定笔记信息
    getNoteInfo();

    // Init();
</script>

<style scoped>
.note-title-input{
    --n-border:none;
    --n-padding-left:0;
    background-color: transparent;
    font-size: 18px;
    font-weight: 600;
    flex:1;
}

.note-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    height: 48px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
}

.note-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    flex: 1;
    line-height: 1.4;
}

.note-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.delete-btn {
    min-width: 24px;
    justify-content: center;
    color: #999;
}
.delete-btn:hover {
    color: #d03050;
}

.note-main {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 16px 16px 0;
}

.editor-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

.status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 22px;
    padding: 0 10px;
    font-size: 12px;
    border-top: 1px solid #e0e0e0;
    color: #666;
    user-select: none;
}

.status-bar__item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.status-bar__btn {
    font-size: 12px;
    color: #666;
    padding: 0;
    margin: 0;
    height: 18px;
    line-height: 18px;
}

.editor-wrapper :deep(.cherry-toolbar) {
    padding: 0 8px;
    min-height: 34px;
    line-height: 2;
}

.editor-wrapper :deep(.cherry-toolbar .toolbar-left) {
    min-height: 34px;
}

.editor-wrapper :deep(.cherry-toolbar .toolbar-right) {
    min-height: 0;
}

.editor-wrapper :deep(.cherry-toolbar-button) {
    height: 28px;
    padding: 0 6px;
}

.editor-wrapper :deep(.cherry-toolbar-button .ch-icon) {
    font-size: 14px;
}

.editor-wrapper :deep(.cherry-toolbar-split) {
    margin: 5px 2px;
    height: 17px;
}

.editor-wrapper :deep(.cherry-dropdown-item) {
    height: 30px;
    line-height: 30px;
}

/* 隐藏 cherry-markdown 默认侧边栏竖条区域 */
.editor-wrapper :deep(.cherry-sidebar) {
    display: none !important;
}
</style>