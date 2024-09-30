<template>
    <!--笔记页面容器-->
    <n-layout has-sider>
        <!--笔记列表容器-->
        <n-layout-sider
            bordered
            show-trigger
            :collapsed-width="0"
            :width="340"
            class="note-list"
        >
            <n-scrollbar @scroll="contextMenu.show=false">
                <!--标题区 新增笔记按钮-->
                <n-card :bordered="false" style="position:sticky;top:0;z-index:1;width:calc(100%-1px)">
                    <template #action>
                        <n-space align="center" justify="space-between">
                            <h3 style="margin:0">笔记列表</h3>
                            <!--创建笔记按钮-->
                            <n-button circle type="primary" @click="createNote">
                                <n-icon :component="PlusRound" :size="22"></n-icon>
                            </n-button>
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
                        :class="{'contexting':(contextMenu.id === note.id && contextMenu.show) ,'editing':(selectNoteId === note.id)}"
                        @click="goEditNoteView(note.id)">
                            <NoteCard :id="note.id" :title="note.title??noteContent.defaultTitle" :desc="note.content" :top="!!note.top" :time="note.update_time"></NoteCard>
                        </n-list-item>
                    </template>
                </n-list>

                <!--暂无笔记-->
                <n-empty v-if="!loading && noteList.length == 0"  style="width:max-content;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)" size="huge" description="暂无笔记列表">
                    <template #icon>
                        <n-icon :component="SubtitlesOffOutlined"></n-icon>
                    </template>
                    <template #extra>
                        <n-button dashed @click="createNote">创建笔记</n-button>
                    </template>
                </n-empty>

            </n-scrollbar>
        </n-layout-sider>

        <!--笔记编辑容器-->
        <n-layout-content embeded content-style="padding:20px">
            <!--子路由-->
            <router-view @save="getNoteList(false,false)" :change-state="isChangeEditNote" :action-id="contextMenu.id"/>
        </n-layout-content>

    </n-layout>

    <!--删除提醒框-->
    <DeleteRemindDialog 
    :show="displayDeleteRemind"
    :title="contextMenu.title"
    @delete="deleteNote"
    @cancel="displayDeleteRemind=false"></DeleteRemindDialog>

    <!--右键菜单-->
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
</template>

<script setup>
    import {computed, ref,inject, onBeforeUnmount, provide} from 'vue'
    import {useUserStore} from '../../stores/userStore'
    import {PlusRound,SubtitlesOffOutlined,
        DriveFileRenameOutlineOutlined,
        DeleteOutlineRound,ArrowCircleDownRound,
        ArrowCircleUpRound} from'@vicons/material'
    import NoteCard from '@/components/note/NoteCard.vue'
    import noteServerRequest  from "../../request"
    import noteApi from '../../request/api/noteApi';
    import DeleteRemindDialog from "../../components/remind/DeleteRemindDialog.vue"
    import {useMessage,NIcon} from 'naive-ui'
    import gsap from "gsap"
    import { toHerf } from '../../router/go';
    import bus from 'vue3-eventbus'

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
        }
    );

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

    //消息对象
    const message = useMessage()

    //读图标
    function renderIcon(icon){
        return ()=>h(NIcon,null,{default:()=>h(icon)})
    }

    //是否处于加载状态
    const loading = ref(true)

    //笔记列表
    const noteList = ref([]);

    //显示是否需要延迟动画
    let enterDelay = true;
    //隐藏是否需要延迟动画
    let hiddenAnimation = true

    //执行显示动画之前的初始位置
    const beforeEnter = (el)=>{
        gsap.set(el,{
            x:30,
            opacity:0
        })
    }

    //执行显示动画
    const enterEvent = (el,done)=>{
        gsap.to(el,{
            overflowX:0,//偏移量
            opacity:1,//透明度
            duration:0.5,//秒
            delay:()=>{enterDelay ? el.dataset.index * 0.12 : 0},//延迟动画
            onComplete:done//动画执行完成回调函数
        })
    }

    //执行隐藏动画之前的初始位置
    const beforeLeave = (el)=>{
        if(hiddenAnimation)
        {
            //获取删除的元素距离父组件的左和上的位置
            const left = el.offsetLeft
            const top = el.offsetTop
            //设置删除组件的属性（需要脱离文档流）
            gsap.set(el,{
                position:'absolute',
                boxShadow: '0 0 5px black',
                width:'calc(100%-24px)',
                zIndex:1,
                top:top,
                left:left,
                backdropFilter:'blur(5px)'
            })
        }
    }

    //执行隐藏动画
    const leaveEvent = (el,done)=>{
        if(hiddenAnimation)
        {
            gsap.to(el,{
                scale:0,
                duration:0.5,
                onComplete:done
            });
        }
        else
        {
            gsap.to(el,{
                duration:0,//秒
                onComplete:done//动画执行完成回调函数
            })
        }
    }

    //获取用户笔记列表
    /**
     * @param ed {Boolean} 显示是否需要延迟动画
     * @param ha {Boolean} 隐藏是否需要延迟动画
     */
     const getNoteList =async (ed,ha)=>{
        enterDelay = ed;
        hiddenAnimation = ha;

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

    //右键菜单对象
    const contextMenu = ref({
        id:null,//笔记编号
        title:'',//笔记标题
        top:false,//笔记是否置顶
        x:0,//X轴坐标
        y:0,//Y轴坐标
        show:false,//是否显示右键菜单
        options:computed(()=>{
            return [
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
        ]
        })
    });

    //
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
        }
        else if(key == "delete")
        {
            displayDeleteRemind.value = true;
        }
    }

    /**
     * 置顶/取消置顶笔记
     * @param {Boolean} isTop true置顶 false非彻底删除
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

    //删除提醒框的对象
    const displayDeleteRemind = ref(false);

    /**
     * 删除笔记
     * @param {Boolean} complete true彻底删除 false非彻底删除
     */
    const deleteNote = async (complete)=>{
        //关闭提醒框
        displayDeleteRemind.value = false;

        //获取API
        let API = {...noteApi.deleteNote}
        API.name = complete?API.name[1]:API.name[0];
        //请求URL的参数
        API.params = {
            isCompleteDel:complete,
            noteId:contextMenu.value.id
        }

        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                //重新获取便签列表 需要有删除动画
                getNoteList(false,true)
                //
                changeEditNoteState(2)
            }
        })
    }

    let noteContent = {
        defaultTitle:'暂未设置标题',
        defaultContent:'暂未设置内容'
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
</script>

<style>
/*只有将笔记列表容器收起来时，切换按钮的位置才会向右偏移*/
.n-layout-sider.n-layout-sider--collapsed.note-list .n-layout-toggle-button {
    right: -30px;
}

/*右键效果*/
.n-list .n-list-item.contexting{
    box-shadow: 0 0 5px #A2A2A2;
}

/*选中效果*/
.n-list .n-list-item.editing{
    box-shadow: 0 0 5px #18A058;
}
</style>