<template>
    <div style="width: 100%;">
        <n-layout has-sider style="height: 100%;">
            <!--笔记本列表及功能页-->
            <n-flex vertical>
                <!--新增按钮-->
                <n-popover v-model:show = "createMenuShow" trigger="click">
                    <template #trigger>
                        <n-button type="primary" text size="large" style="margin-top: 20px;">
                            <template #icon>
                                <n-icon>
                                    <AddBoxRound />
                                </n-icon>
                            </template>
                            新建笔记
                        </n-button>
                    </template>
                    <n-menu :options="createMenu" :indent="18" :on-update:value="clickCreateMenu" />
                </n-popover>
                
                <n-divider style="margin:15px auto"></n-divider>
                <n-flex vertical>
                <n-space>
                    <n-button text size="large" style="margin-left: 28px;height: 30px;" @click="getRecentNoteList(false)" >
                        最近文件
                    </n-button>
                </n-space>

                <!--菜单列-->
                <n-layout-sider
                bordered
                :width="180"
                :native-scrollbar="false"
                >
                    <NotebookTree ref="notebookTree" @NotebookChanged="notebookChanged"/>
                </n-layout-sider>
                <!--底部菜单栏-->
                <n-space>
                    <n-button text size="large" style="margin-left: 28px;height: 30px;" @click="showRecycleBin" >
                        回收站
                    </n-button>
                </n-space>
                </n-flex>
            </n-flex>
            <!--笔记列表及编辑器容器-->
            <n-layout has-sider v-if="!isRecycleBinView">
                <!--笔记列表容器-->
                <n-layout-sider
                    bordered
                    :width="340"
                    class="note-list"
                >
                    <n-scrollbar >
                        <!--标题区 新增笔记按钮-->
                        <n-card :bordered="false" style="position:sticky;top:0;z-index:1;width:calc(100%-1px)">
                            <template #action>
                                <n-space align="center" justify="space-between">
                                    <h3 style="margin:0">笔记列表</h3>
                                </n-space>
                            </template>
                        </n-card>

                        <!--笔记列表骨架屏-->
                        <n-space v-if="loading" vertical style="margin:12px">
                            <n-card size="small" v-for="n in 3" :key="n">
                                <n-space vertical>
                                    <n-skeleton :height="26" :width="120"></n-skeleton>
                                    <n-skeleton text :repeat=2></n-skeleton>
                                    <n-skeleton :height="23" :width="200"></n-skeleton>
                                </n-space>
                            </n-card>
                        </n-space>

                        <!--笔记列表-->
                        <n-list hoverable clickable style="margin:12px">
                            <template v-if="!loading && noteList.length > 0">
                                <n-list-item 
                                v-for="(note,index) in noteList" :key="note.id" 
                                :data-index="index"
                                @contextmenu="showContentMenu($event,note.id,!!note.top,note.title)"
                                :class="{'editing':(selectNoteId === note.id)}"
                                @click="goEditNoteView(note.id)">
                                    <NoteCard 
                                        :id="note.id" 
                                        :title="note.title??noteContent.defaultTitle" 
                                        :desc="note.content" 
                                        :top="!!note.top" 
                                        :time="note.update_time"
                                        :rename="note.rename"
                                        @rename="renameNote"
                                        @cancelRename="displayNoteRenameInput">
                                    </NoteCard>
                                </n-list-item>
                            </template>
                        </n-list>

                        <!--暂无笔记-->
                        <n-empty v-if="!loading && noteList.length == 0"  style="width:max-content;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)" size="huge" description="笔记列表空无一物">
                            <template #icon>
                                <n-icon :component="SubtitlesOffOutlined"></n-icon>
                            </template>
                        </n-empty>

                    </n-scrollbar>
                </n-layout-sider>

                <!--笔记编辑容器-->
                <n-layout-content embeded content-style="padding:20px;">
                    <!--子路由-->
                    <router-view @save="getNoteListInNotebook()" 
                    @deleteSuccess="deleteNoteSuccess" 
                    :change-state="isChangeEditNote"/>
                </n-layout-content>
            </n-layout>
            <n-layout has-sider v-else>
                <Dumpster></Dumpster>
            </n-layout>
        </n-layout>

        <n-dropdown
        placement="bottom-start"
        trigger="manual"
        :x="contextMenu.x"
        :y="contextMenu.y"
        :options="contextMenu.options"
        :show="contextMenu.show"
        :on-clickoutside="clickContextMenuOutSide"
        @select="selectContextMenu"
        />
        <!--删除提醒框-->
        <DeleteRemindDialog @deleteSuccess="deleteNoteSuccess"></DeleteRemindDialog>
    </div>
    
</template>
  
<script setup>
    import {
        SubtitlesOffOutlined,
        MenuBookOutlined as BookIcon,
        AddBoxRound,PlusRound,
        DriveFileRenameOutlineOutlined,
        DeleteOutlineRound,ArrowCircleDownRound,
        ArrowCircleUpRound
    } from "@vicons/material";

    import { NIcon } from "naive-ui";
    import { h,ref,computed,provide,inject,nextTick } from "vue";

    import { toHerf } from "@/router/go";
    
    import noteServerRequest  from "@/request"
    import noteApi from '@/request/api/noteApi';
    
    
    import NoteCard from "@/components/note/NoteCard.vue";
    import NotebookTree from "@/components/note/NotebookTree.vue";

    import Dumpster from "@/components/dumpster/Dumpster.vue";

    import { useDeleteRemindDialogStore } from "@/stores/deleteRemindDialogStore";

    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {DefaultDeleteRemind} = deleteRemindDialogStore;

    const {showFromDumpsterSingle} = deleteRemindDialogStore;
    
    function renderIcon(icon) {
        return () => h(NIcon, null, { default: () => h(icon) });
    }

    //是否是回收站列表
    const isRecycleBinView = ref(false)

    //是否显示新建子菜单
    const createMenuShow = ref(false)

    //点击新建按钮的菜单
    const createMenu =[
        {
            key:'create-note',
            icon:renderIcon(AddBoxRound),
            label:'新建笔记'
        },
        {
            key:'create-notebook',
            icon:renderIcon(AddBoxRound),
            label:'新建文件夹'
        },
    ]

    //新建菜单选项回调
    const clickCreateMenu = (key,value)=>{
        //关闭用户菜单弹出信息
        createMenuShow.value = false

        switch(key){
            case "create-note":
                createNote();
                break;
            case "create-notebook":
                createNotebook();
                break;
        }
    }

    const editNoteUID = ref(null)

    provide('editNoteUID',editNoteUID);

    //路由地址
    const routerPath = inject('routerPath');

    const selectNoteId = computed(()=>{
        const indexOf = routerPath.value.indexOf('/note/edit/');
        if(indexOf === -1)
        {
            return null;
        }
        else
        {
            return parseInt(routerPath.value.substring('/note/edit/'.length));
        }
    });

    //是否处于加载状态
    const loading = ref(true)

    //笔记列表
    const noteList = ref([]);

    let noteContent = {
        defaultTitle:'暂未设置标题',
        defaultContent:'暂未设置内容'
    }

    //选择了不同的笔记本，笔记列表改变
    function notebookChanged(e)
    {
        //更新笔记列表数据
        noteList.value = e;
        //停止显示骨架屏
        loading.value = false;

        isRecycleBinView.value = false;
        //关闭正在编辑的笔记页面
        changeEditNoteState(2)
    }

    let notebookTree = ref(null);
    /**
     * 获取指定笔记本内的笔记列表
    */
    function getNoteListInNotebook(){
        notebookTree.value.getNotesList();
    }

    /**
     * 前往编辑笔记的视图
     * @param {Number} id 笔记编号
     */
    const goEditNoteView = (id)=>{
        console.log("got edit note view =>",id);
        if(id)
        {
            toHerf(`/note/edit/${id}`);
        }
        else
        {
            message.error("前往笔记编辑页失败");
        }
    }

    //右键菜单对象
    const contextMenu = ref({
        id:null,//笔记编号
        title:'',//笔记标题
        top:false,//笔记是否置顶
        x:0,//X轴坐标
        y:0,//Y轴坐标
        show:false,//是否显示右键菜单
        options:computed(()=>{
            let normalContextMenu = [
                {
                    label:"重命名",
                    key:"rename",
                    icon:renderIcon(DriveFileRenameOutlineOutlined)
                },
                {
                    label:"删除",
                    key:"delete",
                    icon:renderIcon(DeleteOutlineRound)
                },
                {
                    label:"取消置顶",
                    key:"cancel-top",
                    icon:renderIcon(ArrowCircleDownRound),
                    show:contextMenu.value.top
                },
                {
                    label:"置顶",
                    key:"top",
                    icon:renderIcon(ArrowCircleUpRound),
                    show:!contextMenu.value.top
                },
            ];
            return normalContextMenu;
        })
    });

    //显示上下文菜单
    const showContentMenu = (e,id,top,title)=>{
        e.preventDefault();
        contextMenu.value.show = false;
        nextTick().then(() => {
            contextMenu.value.show = true;
            contextMenu.value.x = e.clientX;
            contextMenu.value.y = e.clientY;
            contextMenu.value.id = id;
            contextMenu.value.top = top,
            contextMenu.value.title = title??noteContent.defaultTitle
        });
    };

    const clickContextMenuOutSide = ()=>{
        contextMenu.value.show = false;
    };

    /**
     * 笔记重命名输入框显示或隐藏
     * @param id 
     * @param show 
     */
     const displayNoteRenameInput = (id,show=false)=>{
        noteList.value.some(item=>{
            if(item.id == id)
            {
                item.rename = show;
                return true;
            }
        })
    }

    //点击了右键菜单某一项
    const selectContextMenu = (key)=>{
        contextMenu.value.show = false;
        if(key =="cancel-top")
        {
            SetNoteTop(false);
        }
        else if(key == "top")
        {
            SetNoteTop(true);
        }
        else if(key=="rename")
        {
            //重命名
            displayNoteRenameInput(contextMenu.value.id,true);
        }
        else if(key == "delete")
        {
            console.log("NoteIndex delete note");
            DefaultDeleteRemind({
                id:contextMenu.value.id,
                title:contextMenu.value.title,
                type:1,
                key:contextMenu.value.id+':'+1
            })
        }
        else if(key =="restore")
        {
            let note = {
                id:contextMenu.value.id,
                title:contextMenu.value.title,
                type:1,
            }
            restoreNote(note)
        }
        else if(key =="complete-delete")
        {
            let note = {
                id:contextMenu.value.id,
                title:contextMenu.value.title,
                type:1,
            }
            showFromDumpsterSingle(note);
        }
    }

    /**
     * 创建笔记
     */
    const createNote = ()=>{
        notebookTree.value.addNewNote();
    }

    /**
     * 新建笔记本
     */
    function createNotebook()
    {
        notebookTree.value.addNewNoteBook();
    }

    /**
     * 笔记重命名
     * @param {Object} note 
     */
     const renameNote = (note)=>{
        console.log("rename note");
        //关闭重命名输入框
        displayNoteRenameInput(note.id,false);

        //发送请求
        let API = {...noteApi.renameNote};
        API.data = {...note}
        //发送请求
        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                //重新获取笔记列表
                getNoteListInNotebook();
                //通知子组件笔记状态发生改变
                changeEditNoteState(1)
            }
        })
    }

    /**
     * 置顶/取消置顶笔记
     * @param {Boolean} isTop true置顶 false取消置顶
     */
    const SetNoteTop = async (isTop)=>{
        let API = {...noteApi.topNote};
        API.name = isTop ? API.name[0]:API.name[1];
        //请求URL的参数
        API.params= {
            targetTop:isTop?1:0,
            noteId:contextMenu.value.id
        };

        //发送请求
        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                //重新获取笔记列表
                getNoteList(false,false);
            }
        })
    }
    
    //----------------删除笔记-------------------

    const isChangeEditNote = ref(0)//0 不需要改变 1 需要重新加载 2 需要关闭

    //改变编辑笔记状态
    const changeEditNoteState = state =>{
        isChangeEditNote.value = state;
        setTimeout(() => {
            isChangeEditNote.value = 0;
        }, 1000);
    }

    /**
     * 删除笔记成功操作
     */
     const deleteNoteSuccess = ()=>{
        console.log("NoteIndex==>deleteNoteSuccess")
        getNoteListInNotebook()
        console.log("关闭编辑笔记")
        //删除笔记成功，关闭正在编辑笔记
        changeEditNoteState(2)
    }

    function getRecentNoteList(isInit = true)
    {
        if(!isInit)
        {
            console.log("notebookTree.value=>",notebookTree.value)
            notebookTree.value.ClearSelectNode();
        }
        
        isRecycleBinView.value = false;
        noteServerRequest(noteApi.getRecentNoteList).then(responseData=>{
            if(responseData)
            {
                noteList.value = responseData.data;
                loading.value = false;
            }
        })
    }

    //显示回收站界面
    function showRecycleBin()
    {
        isRecycleBinView.value = true;
        notebookTree.value.ClearSelectNode();
    }

    function Init()
    {
        console.log("Note Index view init");
        getRecentNoteList();
    }

    Init();
</script>

<style>
/*只有将笔记列表容器收起来时，切换按钮的位置才会向右偏移*/
.n-layout-sider.n-layout-sider--collapsed.note-list .n-layout-toggle-button {
    right: -30px;
}

/*选中效果*/
.n-list .n-list-item.editing{
    box-shadow: 0 0 5px #18A058;
}
</style>