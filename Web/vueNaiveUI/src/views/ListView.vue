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
        <n-list-item>
            <n-thing title="文章标题">
                <template #description>
                    <n-space>
                        <n-button size="tiny" secondary>
                        点赞
                        </n-button>
                    </n-space>
                </template>
            </n-thing>
            <template #suffix>
                <n-thing title="作者" description="2025/6/26">
                </n-thing>
            </template>
        </n-list-item>
        <n-list-item>
            <n-thing title="文章标题">
                <template #description>
                    <n-space>
                        <n-button size="tiny" secondary>
                        16.5K 点赞
                        </n-button>
                    </n-space>
                </template>
            </n-thing>
            <template #suffix>
                <n-thing title="作者" description="2025/6/26">
                </n-thing>
            </template>
        </n-list-item>
    </n-list>
</template>
<script setup>
    import { useMessage } from "naive-ui";
    const message = useMessage();
</script>