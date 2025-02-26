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
                
                <!--菜单列-->
                <n-layout-sider
                bordered
                show-trigger
                collapse-mode="width"
                :collapsed-width="64"
                :width="240"
                :native-scrollbar="false"
                >
                    <div style="margin-left: 24px;">
                        <n-button text size="large" @click="getRecentNoteList" >
                            最近文件
                        </n-button>
                    </div>
                    <NotebookTree ref="notebookTree" @NotebookChanged="notebookChanged"/>
                    <n-menu
                        :collapsed-width="64"
                        :collapsed-icon-size="22"
                        :options="bottomMenu"
                    />
                </n-layout-sider>
            </n-flex>
            <!--笔记列表及编辑器容器-->
            <n-layout has-sider>
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
                                :class="{'editing':(selectNoteId === note.id)}"
                                @click="goEditNoteView(note.id)">
                                    <NoteCard :id="note.id" :title="note.title??noteContent.defaultTitle" :desc="note.content" :top="!!note.top" :time="note.update_time"></NoteCard>
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
                    <router-view @save="getNoteListInNotebook()" @deleteSuccess="deleteNoteSuccess" :change-state="isChangeEditNote"/>
                </n-layout-content>

            </n-layout>
        </n-layout>
    </div>
</template>
  
<script setup>
    import {
        SubtitlesOffOutlined,
        MenuBookOutlined as BookIcon,
        AddBoxRound
    } from "@vicons/material";
    import { NIcon } from "naive-ui";
    import { h,ref,computed,provide,inject } from "vue";

    import { toHerf } from "@/router/go";
    
    import noteServerRequest  from "@/request"
    import noteApi from '@/request/api/noteApi';
    
    import NoteCard from "@/components/note/NoteCard.vue";
    import NotebookTree from "@/components/note/NotebookTree.vue";
    
    function renderIcon(icon) {
        return () => h(NIcon, null, { default: () => h(icon) });
    }

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

    const bottomMenu = [
        {
            label: "回收站",
            key: "recycle-bin",
            icon: renderIcon(BookIcon)
        }
    ]

    //笔记列表
    const noteList = ref([]);

    let noteContent = {
        defaultTitle:'暂未设置标题',
        defaultContent:'暂未设置内容'
    }

    function notebookChanged(e)
    {
        noteList.value = e;
        //停止显示骨架屏
        loading.value = false;
    }

    let notebookTree = ref(null);
    /**
     * 获取指定笔记本内的笔记列表
    */
    function getNoteListInNotebook(){
        notebookTree.getNotesList();
    }

    /**
     * 前往编辑笔记的视图
     * @param {Number} id 笔记编号
     */
    const goEditNoteView = (id)=>{
        if(id)
        {
            toHerf(`/note/edit/${id}`);
        }
        else
        {
            message.error("前往笔记编辑页失败");
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
     * @param {Boolean} complete true彻底删除 false非彻底删除
     */
     const deleteNoteSuccess = ()=>{

        getNoteListInNotebook()
        //
        changeEditNoteState(2)
    }

    function getRecentNoteList()
    {
        noteServerRequest(noteApi.getRecentNoteList).then(responseData=>{
            if(responseData)
            {
                noteList.value = responseData.data;
                loading.value = false;
            }
        })
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