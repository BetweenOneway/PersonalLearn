<template>
    <n-layout>
        <n-layout-header>
            <RouterLink to="/tree">测试树状组件</RouterLink>
        </n-layout-header>
        <n-divider />
        <n-layout-content content-style="padding: 24px;">
            <RouterView />
        </n-layout-content>
    </n-layout>
</template>

<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>
