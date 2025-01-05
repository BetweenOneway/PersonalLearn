<template>
    <div>
        <n-layout has-sider style="height: 100%;">
            <n-flex vertical>
                <!--新增按钮-->
                <n-button type="primary" text size="large" style="margin-top: 20px;">
                    <template #icon>
                        <n-icon>
                            <AddBoxRound />
                        </n-icon>
                    </template>
                    新建笔记
                </n-button>
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
                    <n-menu
                        :collapsed-width="64"
                        :collapsed-icon-size="22"
                        :options="menuOptions"
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
                    <n-scrollbar @scroll="contextMenu.show=false">
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
                <n-layout-content embeded content-style="padding:20px">
                    <!--子路由-->
                    <router-view @save="getNoteList(false,false)" @deleteSuccess="deleteNoteSuccess" :change-state="isChangeEditNote"/>
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
    import { h,ref,onBeforeUnmount,watch } from "vue";
    import bus from 'vue3-eventbus'
    import { storeToRefs } from 'pinia'

    import { useUserStore } from "@/stores/userStore";
    import { loginInvalid } from "@/Utils/userLogin";
    import { toHerf } from "@/router/go";
    
    import noteServerRequest  from "@/request"
    import noteApi from '@/request/api/noteApi';
    import NoteCard from "@/components/note/NoteCard.vue";
    
    function renderIcon(icon) {
        return () => h(NIcon, null, { default: () => h(icon) });
    }
  
    const userStore = useUserStore();
    const {token,id:user_id} = storeToRefs(userStore);

    watch(
        ()=>token.value,
        newData=>{
            //是否重新进行登录
            if(newData !== null)
            {
                //处于加载状态
                loading.value = true;
                //重新获取用户笔记列表
                getNoteList(true,false);
                //判断编辑笔记用户编号是否和登录用户编号一致 不一致则关闭笔记页面
                if(editNoteUID.value && user_id.value !== editNoteUID)
                {
                    toHerf('/note');
                }
            }
            else{
                console.log("note login invalid")
                loginInvalid(true);
            }
        }
    );

    //是否处于加载状态
    const loading = ref(true)

    const menuOptions = [
    {
        label: "我的文件夹",
        key: "my-folder",
        icon: renderIcon(BookIcon),
        children: [
            {
                label: "人物",
                key: "people",
                children: [
                {
                    label: "叙事者",
                    key: "narrator",
                    icon: renderIcon(BookIcon)
                },
                {
                    label: "羊男",
                    key: "sheep-man",
                    icon: renderIcon(BookIcon)
                }
            ]
            },
            {
                label: "饮品",
                key: "beverage",
                icon: renderIcon(BookIcon),
                children: [
                    {
                        label: "威士忌",
                        key: "whisky"
                    }
                ]
            },
            {
                label: "食物",
                key: "food",
                children: [
                    {
                        label: "三明治",
                        key: "sandwich"
                    }
                ]
            },
            {
                label: "过去增多，未来减少",
                key: "the-past-increases-the-future-recedes"
            }
        ]
    },
    {
        label: "回收站",
        key: "recycle-bin",
        icon: renderIcon(BookIcon)
    }
    ];

    //笔记列表
    const noteList = ref([]);

    let noteContent = {
        defaultTitle:'暂未设置标题',
        defaultContent:'暂未设置内容'
    }

        //获取用户笔记列表
    /**
     * @param ed {Boolean} 显示是否需要延迟动画
     * @param ha {Boolean} 隐藏是否需要延迟动画
     */
     const getNoteList =async (ed,ha)=>{

        noteServerRequest(noteApi.getNoteList).then(responseData=>{
            if(responseData)
            {
                //封装笔记列表
                noteList.value = responseData.data;
                //停止显示骨架屏
                loading.value = false;
            }
        })
    }

    getNoteList(true,false);

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
        //发送请求
        noteServerRequest(noteApi.createNote).then(responseData=>{
            if(responseData) 
            {
                //跳转编辑笔记路由
                goEditNoteView(responseData.data.noteId);
                //重新获取便签列表 新增笔记不需要显示的延迟动画
                getNoteList(false,false);
            }
        })
    }

    bus.on('createNewNote',createNote)

    //当组件卸载完毕之前 移除监听
    onBeforeUnmount(()=>{
        //
        bus.off('createNewNote',createNote)
    })

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

        getNoteList(false,true)
        //
        changeEditNoteState(2)
    }

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