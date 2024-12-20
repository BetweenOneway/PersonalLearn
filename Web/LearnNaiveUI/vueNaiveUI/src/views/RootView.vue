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
</template>

<script setup>
import MainTopNavBar from '@/components/navbar/MainTopNavBar.vue';
</script>