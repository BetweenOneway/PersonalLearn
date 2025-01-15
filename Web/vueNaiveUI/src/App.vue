<template>
    <n-layout>
        <n-layout-content content-style="padding: 24px;">
            <RouterView />
        </n-layout-content>
    </n-layout>
</template>

<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>
