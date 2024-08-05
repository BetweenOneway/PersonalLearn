<template>
    <!--布局-->
    <n-layout position="absolute">
        <!--应用头-->
        <n-layout-header bordered style="height: 64px;padding:0 20px;">
            <MainTopToolbar />
        </n-layout-header>
        <n-layout position="absolute" has-sider style="top:64px">
            <!--左侧应用栏-->
            <n-layout-sider bordered width="64px" content-style="padding: 24px 0; text-align:center;">
                <MainLeftToolBar />
            </n-layout-sider>
            <!--主页面-->
            <router-view/>
        </n-layout>
    </n-layout>
    <login-modal/>
</template>

<script setup>
    import MainTopToolbar from "./components/toolbar/MainTopTooolbar.vue"
    import MainLeftToolBar from "./components/toolbar/MainLeftToolBar.vue"
    import LoginModal from "./components/login/LoginModal.vue"
    import { ref,watch,inject } from "vue"
    import {useDialog} from 'naive-ui'

    //对话框对象
    const dialog = useDialog();

    const loginStatusDialog = ref(null);

    //接收祖先组件提供的数据
    const needReload = inject('needReload');

    watch(
        ()=>needReload.value,
        newData=>{
            if(newData)
            {
                changeLoginStatusDialog();
            }
        }
    );
    //登录状态发生改变的对话框
    const changeLoginStatusDialog = ()=>{
        if(loginStatusDialog.value === null)
        {
            //创建新对话框
            loginStatusDialog.value = dialog.create({
                showIcon:false,
                content:'登录状态已改变，需要重新加载页面',
                positiveText:'重新加载页面',
                positiveButtonProps:{
                    text:true,
                    tertiary:true
                },
                onPositiveClick:()=>{
                    //用户登陆状态发生改变 重新刷新页面
                    window.location.reload();
                    return false;
                },
                closable:false,//不显示关闭图标
                closeOnEsc:false,
                maskClosable:false
            });
        }
    };
</script>