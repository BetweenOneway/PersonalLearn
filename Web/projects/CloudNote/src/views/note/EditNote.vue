<template>
    <!--骨架屏-->
    <n-space vertical :wrap-item="false" v-if="loading">
        <n-skelton :height="36" width="100%"></n-skelton>
        <n-skelton text width="30%"></n-skelton>
        <n-skelton text width="60%"></n-skelton>
        <n-skelton text width="40%"></n-skelton>
        <n-skelton text width="80%"></n-skelton>
    </n-space>
    <n-space vertical v-else>
        <!--发布时间 分享 更多操作-->
        <n-card :bordered="false" size="small">
            <n-space justify-content="space-between" align="center">
                <!--发布时间-->
                <n-space color="#18A058" align="center" :wrap-item="false">
                    <n-icon :component="FiberManualRecordRound"></n-icon>
                    <n-text depth="3">保存并发布于:{{ note.update_time }}</n-text>
                </n-space>
                <!--功能按钮区-->
                <n-space align="center" :wrap-item="false" :size="8">
                    <n-button round dashed>分享</n-button>
                    <!--收藏-->
                    <n-popover>
                        <template #trigger>
                            <n-button quaternary circle>
                                <n-icon size="20" :component="StarBorderRound"/>
                            </n-button>
                        </template>
                        收藏
                    </n-popover>
                    
                    <n-button quaternary circle>
                        <n-icon size="20" :component="MoreHorizRound"/>
                    </n-button>
                </n-space>
            </n-space>
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
    </n-space>
    
</template>

<script setup>
    import { Ckeditor } from '@ckeditor/ckeditor5-vue';
    import {EditorType,getEditorConfigs} from "@/editor"
    import { getUserToken,loginInvalid } from "../../Utils/userLogin";
    import { noteBaseRequest } from "../../request/noteRequest";
    import {useMessage,useLoadingBar} from 'naive-ui'
    import {FiberManualRecordRound,
        StarBorderRound,
        MoreHorizRound
    } from'@vicons/material'
    import 'ckeditor5/ckeditor5.css';
    
    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    //const ckeditor5 = CKEditor.component;

    const propsData = defineProps({
        id:{type:Number,required:true}
    })

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
        //判断用户登录状态
        const userToken = await getUserToken()

        //头部加载进度条开始
        loadingBar.start()

        const {data:responseData} = await noteBaseRequest.get(
                "/note/getNoteInfo",
                {
                    params:{
                        userToken:userToken,
                        noteId:propsData.id
                    }
                }
            ).catch(()=>{
                //加载条异常结束
                loadingBar.error()
                //显示失败的通知
                throw message.error("获取笔记信息失败")
            }
        )

        if(responseData.success)
        {
            loading.value = false;
            loadingBar.finish();
            console.log(responseData.data)
            note.value = responseData.data;
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
     * 
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

    onMounted(()=>{
        windows.addEventListener('keydown',(e)=>{
            console.log(e);
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

    const saveNote = async ()=>{
        //编号
        const noteId = propsData.id;
        //标题
        const title = editor.plugins.get('Title').getTitle();
        //内容
        const body = editor.plugins.get('Title').getBody();
        //笔记完整内容
        const content = note.value.content;

        //判断用户登录状态
        const userToken = await getUserToken()

        loadingBar.start();
        const {data:responseData} = await noteBaseRequest.post(
                "/note/saveNote",
                {
                    params:{
                        userToken:userToken,
                        noteId:propsData.id,
                        title:title,
                        body:body,
                        content:content
                    }
                }
            ).catch(()=>{
                loadingBar.error();
                //显示失败的通知
                throw message.error("保存笔记失败")
            }
        )

        if(responseData.success)
        {
            loadingBar.finish();
            message.success(responseData.message);
            console.log(responseData.data)
            note.update_time = responseData.data.update_time;
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