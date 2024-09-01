<template>
    <n-space vertical>
        <!--添加文件-->
        <n-dropdown :options="addBoxOptions" placement="right-start">
            <n-button text type="primary">
                <n-icon size="34" :component="AddBoxRound"></n-icon>
            </n-button>
        </n-dropdown>

        <!--搜索-->
        <n-button text>
            <n-icon size="26" :component="SearchRound"></n-icon>
        </n-button>
    </n-space>
    <!--分割线-->
    <n-divider style="width:34px;margin:15px auto"></n-divider>

    <n-space vertical :size="26">
        <n-popover v-for="menu in mainMenus" :key="menu.label" trigger="hover" placement="right" :show-arrow="false">
            <template #trigger>
                <n-button style="width:34px;padding:0" 
                :quaternary="!isHighLightMenuItem(menu.to)" 
                :type="isHighLightMenuItem(menu.to)?'primary':'default'" 
                :tertiary="isHighLightMenuItem(menu.to)" 
                @click="router.push(menu.to)">
                    <n-icon size="menu.icon_size" :component="menu.icon"></n-icon>
                </n-button>
            </template>
            <span>{{menu.label}}</span>
        </n-popover>
    </n-space>
</template>

<script setup>
    import {AddBoxRound,EventNoteRound,StickyNote2Outlined
        ,SearchRound,AccessTimeRound
        , StarBorderRound, ShoppingBagOutlined, DeleteOutlineRound} from "@vicons/material"
    import {NIcon} from "naive-ui"
    import {h,watch,inject} from 'vue'
    import {useRouter} from 'vue-router'
    import bus from 'vue3-eventbus'
    
    //路由对象
    const router = useRouter()
    
    const routerPath = inject('routerPath');

    //读图标
    function renderIcon(icon,size,color){
        return ()=>h(NIcon,{size,color},{default:()=>h(icon)})
    }

    //新增笔记、便签菜单
    const addBoxOptions=[
        {
            label:"新增笔记",
            key:"note",
            icon:renderIcon(StickyNote2Outlined,20,'#18A058'),
            props:{
                onClick:()=>{}
            }
        },
        {
            label:"新增便签",
            key:"memo",
            icon:renderIcon(EventNoteRound,20,'#2080F0'),
            props:{
                onClick:()=>{
                    //跳转至路由为/memo
                    router.push("/memo").then(()=>{
                        //弹出便签编辑框
                        bus.emit('newCreateMemo');
                    })
                }
            }
        }
    ]

    const mainMenus = [
        {
            label:'最近操作',//弹出信息
            icon:AccessTimeRound,//图标
            icon_size:24,//图标大小
            to:''//路由地址
        },
        {
            label:'笔记',
            icon:StickyNote2Outlined,
            icon_size:24,
            to:'/note'
        },
        {
            label:'便签',
            icon:EventNoteRound,
            icon_size:24,
            to:'/memo'
        },
        {
            label:'收藏',
            icon:StarBorderRound,
            icon_size:28,
            to:''
        },
        {
            label:'商城',
            icon:ShoppingBagOutlined,
            icon_size:24,
            to:''
        },
        {
            label:'回收站',
            icon:DeleteOutlineRound,
            icon_size:28,
            to:''
        },
    ];

    /**
     * 是否高亮显示菜单按钮
     * @param {String} toRouterPath 路由地址
     */
    const isHighLightMenuItem = (toRouterPath)=>{
        if(!toRouterPath)
        {
            return false;
        }
        
        var reg=new RegExp("^" + toRouterPath,"ig")
        return reg.test(routerPath.value)//.startWith(toRouterPath)
    }
</script>