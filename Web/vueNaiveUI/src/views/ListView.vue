<template>
    <n-list hoverable clickable>
        <n-list-item @click="message.info('click')">
            <n-thing title="Thing" title-extra="extra" description="description" />
        </n-list-item>
        <n-list-item>
            <n-thing title="Thing" title-extra="extra" description="description" />
        </n-list-item>
        <n-list-item>
            <n-thing title="Thing" title-extra="title-extra">
                <template #header-extra>
                    header-extra
                </template>
                <template #description>
                    description插槽
                </template>
                <template #icon>
                    图标插槽
                </template>
            </n-thing>
        </n-list-item>
        <n-list-item>
            <template #prefix>
                Prefix
            </template>
            <template #suffix>
                Suffix
            </template>
            <n-thing title="Thing" title-extra="extra" description="description">
            </n-thing>
        </n-list-item>
        <n-list-item>
            hello list item
            <template #suffix>
                <n-thing title="Thing" title-extra="extra" description="description">
                </n-thing>
            </template>
        </n-list-item>
        <n-list-item>
            hello list item 123
            <template #suffix>
                <n-thing title="Thing" title-extra="Extra" description="description">
                </n-thing>
            </template>
        </n-list-item>
    </n-list>
</template>
<script setup>
    import { useMessage } from "naive-ui";
    const message = useMessage();
</script>