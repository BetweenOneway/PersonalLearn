
<template>
    <input type="text" v-model="editorContent"/>
    <button @click="getContent">show</button>
    <button @click="SwitchMode">{{editButtonText}}</button>
    <div class="Editor-container">
        <div id="markdown-container"></div>
    </div>
</template>
    
<script setup>
    import { onMounted, ref, watch } from 'vue';
    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';
    
    const editorContent = ref('## hello world');
    const isEditMode = ref(true);
    const editButtonText = ref("预览")

    // //<!--这种用法有个问题,就是修改界面之后，或者浏览器最小化后重新刷新，界面会显示多个编辑器
    // const cherryInstance = new Cherry(
    //     {
    //         id: 'markdown-container',
    //         value: editorContent.value,
    //     }
    // );
    let cherryInstance = null;
    onMounted(()=>{
        cherryInstance = new Cherry(
            {
                id: 'markdown-container',
                value: editorContent.value,
                editor: {
                    defaultModel: 'previewOnly',
                },
                toolbars: {
                    // 定义顶部工具栏
                    toolbar: ['bold','italic','strikethrough','|','color','header','|','list'],
                    // 定义侧边栏，默认为空
                    sidebar: [],
                    // 定义顶部右侧工具栏，默认为空
                    toolbarRight: [],
                    // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
                    bubble: false,
                    // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
                    float: false,
                    hiddenToolbar: ['panel', 'justify'],
                },
            }
        );
    })


    watch(editorContent,async (newValue,oldValue)=>{
        console.log("editorContent value changed,",oldValue,"=>",newValue);
        cherryInstance.setValue(newValue);
    })

    function getContent()
    {
        console.log("cherryInstance.getValue=>",cherryInstance.getValue())
        console.log("cherryInstance.getHtml=>",cherryInstance.getHtml())
    }

    function SwitchMode()
    {
        console.log("switch mode=>",isEditMode.value)
        //编辑=>预览
        if(isEditMode.value == true)
        {
            cherryInstance.switchModel('previewOnly');
            editButtonText.value = "编辑"
            
        }
        else{
            cherryInstance.switchModel('edit&preview');
            editButtonText.value = "预览"
        }
        isEditMode.value = !isEditMode.value
    }
</script>

<style scoped>
    .Editor-container{
        width: 300px;
        height: 500px;
    }
</style>