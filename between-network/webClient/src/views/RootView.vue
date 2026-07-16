<template>
    <n-layout>
        <n-layout-header :class="['nav-header', { 'nav-header--dark': isDarkTheme }]">
            <div class="nav-bar">
                <MainTopNavBar />
            </div>
        </n-layout-header>

        <n-layout-content class="main-content">
            <div class="scroll-box">
                <router-view />
                <n-back-top
                    :visibility-height="300"
                    :right="40"
                    :bottom="40"
                />
            </div>
        </n-layout-content>
    </n-layout>
    <login-modal />
</template>

<script setup>
    import MainTopNavBar from '@/components/navbar/MainTopNavBar.vue';
    import LoginModal from '@/components/login/LoginModal.vue';
    import { useThemeStore } from '@/stores/themeStore';
    import { storeToRefs } from 'pinia';
    import { useLoadingBar, useMessage } from 'naive-ui';

    const themeStore = useThemeStore();
    const { isDarkTheme } = storeToRefs(themeStore);

    window.$message = useMessage();
    window.$loadingBar = useLoadingBar();
</script>

<style scoped>
.nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: var(--nav-bar-height);
    display: flex;
    z-index: 100;
    background-color: #f5f6f7;
    border-bottom: 1px solid #e8e8e8;
}

.nav-header--dark {
    background-color: #101014;
    border-bottom-color: #ffffff1a;
}

.nav-bar {
    flex: 1;
    padding-left: 50px;
    padding-right: 50px;
}

.main-content {
    position: relative;
    padding-top: var(--nav-bar-height);
}

.scroll-box {
    width: 100%;
    height: calc(100vh - var(--nav-bar-height));
    overflow: auto;
}
</style>
