<template>
    <MdEditor v-model="text" :toolbarsExclude="toolbarsExclude" 
    @onUploadImg="onUploadImg" 
    @onSave="codeSave"/>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  
  const text = ref('Hello Editor!');

  const toolbars = ['italic', 'underline', '-', 'bold', '=', 'github'];
  const toolbarsExclude=['link', 'mermaid', 'katex', 'github'];

    function onUploadImg(files, callback)
    {
        console.log("uploadImg=>",files);
    }

    function codeSave(v)
    {
        console.log("save=>",v);
    }
</script>