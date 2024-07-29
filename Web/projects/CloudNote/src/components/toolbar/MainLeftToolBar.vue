<template>
    <n-dropdown :options="addBoxOptions" placement="right-start">
        <n-button text type="primary">
            <n-icon size="34" :component="AddBoxRound"></n-icon>
        </n-button>
    </n-dropdown>
</template>

<script setup>
    import {AddBoxRound,EventNoteRound,StickyNote2Outlined,EventNoteRound} from "@vicons/material"
    import {NIcon} from "naive-ui"
    import {h} from 'vue'
    import {useRouter} from 'vue-router'
    import bus from 'vue3-eventbus'
    
    //路由对象
    const router = useRouter()
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
                    //跳转至路由为/thing
                    router.push("/thing").then(()=>{
                        //弹出便签编辑框
                        bus.emit('newCreateMemo');
                    })
                }
            }
        }
    ]
</script>