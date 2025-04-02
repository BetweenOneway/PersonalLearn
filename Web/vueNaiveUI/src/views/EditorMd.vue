<template>
    <div class="editor-container">
        <n-button @click="modeChange">预览/编辑模式切换</n-button>
        <div v-if="isPreviewMode">
            <MdPreview :editorId="id" :modelValue="text" />
            <MdCatalog :editorId="id" :scrollElement="scrollElement" />
        </div>
        <div v-else>
            <MdEditor v-model="text" :toolbarsExclude="toolbarsExclude" 
            @onUploadImg="onUploadImg" 
            @onSave="codeSave"/>
        </div>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { MdEditor,MdPreview, MdCatalog } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  
    const text = ref('Hello Editor!');
    let isPreviewMode = ref(false)

    const toolbars = ['italic', 'underline', '-', 'bold', '=', 'github'];
    const toolbarsExclude=['link', 'mermaid', 'katex', 'github'];
    const scrollElement = document.documentElement;
    
    function onUploadImg(files, callback)
    {
        console.log("uploadImg=>",files);
    }

    function codeSave(v)
    {
        console.log("save=>",v);
    }
    function modeChange()
    {
        isPreviewMode.value = !isPreviewMode.value
    }
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100vh;
  position: relative; /* 确保子元素相对于此容器定位 */
}

.md-editor {
  height: calc(100vh - 50px); /* 设置高度 */
}

.md-editor .md-editor-content {
  height: calc(100% - 50px); /* 调整内容区域高度 */
}


</style>