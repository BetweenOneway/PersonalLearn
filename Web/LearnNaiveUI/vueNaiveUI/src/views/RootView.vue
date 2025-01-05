<template>
    <!--布局-->
    <n-layout position="absolute">
        <!--应用头-->
        <n-layout-header bordered style="height: 64px;padding:0 20px;">
            <MainTopNavBar />
        </n-layout-header>
        <n-layout position="absolute" has-sider style="top:64px">
            <!--主页面-->
            <router-view/>
        </n-layout>
    </n-layout>
    <login-modal/>
</template>

<script setup>
    import MainTopNavBar from '@/components/navbar/MainTopNavBar.vue';
    import LoginModal from '@/components/login/LoginModal.vue';

    import {useLoadingBar, useMessage} from 'naive-ui'

    //将消息对象挂在到window
    window.$message = useMessage();
    //将加载条对象挂载到window
    window.$loadingBar = useLoadingBar();

</script>