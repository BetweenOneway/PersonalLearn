<template>
    <!-- <n-space>
        <div id="markdown-container" style="width:1010px;height:600px"></div>
    </n-space> -->
    <div id="markdown-container"></div>
</template>
 
<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown';
onMounted(() => {
const cherryInstance = new Cherry({
  id: 'markdown-container',
  value: '# welcome to cherry editor wangwei!',
});
})

</script>

<style scoped>
.parent-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

/* .editor-container {
  flex: 1;
  overflow: auto;
} */
</style>