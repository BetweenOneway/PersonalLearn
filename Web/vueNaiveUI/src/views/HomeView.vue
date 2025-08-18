<template>
    <n-flex justify="space-around" align="center" style="height:100vh">
        <n-card>
            <RouterLink to="/test">随便测试</RouterLink>
        </n-card>
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
            <RouterLink to="/cherryMarkdown1">测试CherryMarkdown 1</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/editormd">测试Editor-Md-V3</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/admin">测试Admin页面布局</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/router">测试RouterView</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/layout">学习布局</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/Cropperjs1">学习VueCropperJs2.0-1</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/CropperJs2">学习Cropper2.0-2</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/VueCropper">学习VueCropper</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/VueCropper1">学习VueCropper-1</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/ListView">学习ListView</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/Reuseable">可重用子组件</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/Cards">学习卡片组件</RouterLink>
        </n-card>
        <n-card>
            <RouterLink to="/Life">学习组件生命周期</RouterLink>
        </n-card>
    </n-flex>
</template>

<script setup>
    import { RouterLink } from 'vue-router'
</script>

<style scoped>
.n-card {
  max-width: 300px;
}
</style>