<template>
    <div class="editor-container">
      <div ref="editorContainer"></div>
    </div>
</template>
 
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';

    const editorContainer = ref(null);
    let editor = null;

    onMounted(() => {
        editor = new Cherry({
            el: editorContainer.value,
            //id: 'markdown-container', 
            value: '## hello world', 
        });
    })
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100vh;
  position: relative; /* 确保子元素相对于此容器定位 */
}
</style>
