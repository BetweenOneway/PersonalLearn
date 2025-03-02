<template>
    <n-button @click="modeChange">预览/编辑模式切换</n-button>
    <n-space v-if="isPreviewMode">
        <MdPreview :editorId="id" :modelValue="text" />
        <MdCatalog :editorId="id" :scrollElement="scrollElement" />
    </n-space>
    <n-space v-else>
        <MdEditor v-model="text" :toolbarsExclude="toolbarsExclude" 
        @onUploadImg="onUploadImg" 
        @onSave="codeSave"/>
    </n-space>
    
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