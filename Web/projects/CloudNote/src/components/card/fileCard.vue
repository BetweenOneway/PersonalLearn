<template>
    <n-card embedded :bordered="false" size="small" hoverable>
        <n-space align="center" :wrap-item="false">
            <n-icon :size="32" :component="StickyNote2Outlined"></n-icon>
            <n-space vertical :size="4">
                <n-text>Vue3 知识点整理</n-text>
                <n-text depth="3">4个月前</n-text>
            </n-space>
        </n-space>
    </n-card>
</template>

<script setup>
    import { EventNoteRound,StickyNote2Outlined,ShoppingBagOutlined } from '@vicons/material';
</script>