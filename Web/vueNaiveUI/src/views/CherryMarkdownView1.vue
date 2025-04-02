
<template>
    <input type="text" v-model="editorContent"/>
    <button @click="getContent">show</button>
    <div @click.prevent.stop>
        <div id="markdown-container"></div>
    </div>
</template>
    
<script setup>
    import { ref, watch } from 'vue';
    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';
    
    const editorContent = ref("");

    //<!--这种用法有个问题,就是修改界面之后，或者浏览器最小化后重新刷新，界面会显示多个编辑器
    const cherryInstance = new Cherry(
        {
            id: 'markdown-container',
            value: editorContent.value,
        }
    );

    watch(editorContent,async (newValue,oldValue)=>{
        console.log("editorContent value changed,",oldValue,"=>",newValue);
        cherryInstance.setValue(newValue);
    })

    function getContent()
    {
        console.log("cherryInstance.getValue=>",cherryInstance.getValue())
        console.log("cherryInstance.getHtml=>",cherryInstance.getHtml())
    }
</script>