<template>
    <n-layout>
        <n-layout-content>
            <n-message-provider>
                <RouterView />
            </n-message-provider>
        </n-layout-content>
    </n-layout>
</template>

<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
</style>
