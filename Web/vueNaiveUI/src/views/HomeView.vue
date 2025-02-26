<template>
    <n-flex>
        <n-card>
            <RouterLink to="/tree">测试树状组件</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/tree1">测试树状组件 1</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/for">测试遍历</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/cherryMarkdown">测试CherryMarkdown</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/editormd">测试Editor-Md-V3</RouterLink>
        </n-card>
    </n-flex>
    

</template>

<script setup>
    import { RouterLink } from 'vue-router'
</script>