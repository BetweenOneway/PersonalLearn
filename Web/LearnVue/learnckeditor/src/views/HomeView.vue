<template>
    <div id="app">
        <ckeditor
            v-model="editorData"
            :editor="EditorType"
            :config="editorConfig"
        />
        <!-- <ckeditor
            :editor="EditorType" 
            @ready="editorReady" 
            v-model="editorData"
            :config="editorConfig"/> -->
    </div>
</template>

<script setup>
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
//import { DecoupledEditor,Bold, Essentials, Italic, Mention, Paragraph, Undo} from 'ckeditor5';
import {EditorType} from "@/editor";
//import {getEditorConfigs} from "@/editor";
import {editorConfig} from "@/editor";



import 'ckeditor5/ckeditor5.css';

let editorData = '<p>Hello from CKEditor 5 in Vue!</p>';

/**
 * 编辑器加载完成处理函数
 * 
 */
    const editorReady = (editor)=>{
    // 在编辑器区域插入工具栏
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
}
//import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

// export default {
//     name: 'HomeView',
//     components: {
//         Ckeditor
//     },
//     data() {
//         return {
//             editor: ClassicEditor,
//             editorData: '<p>Hello from CKEditor 5 in Vue!</p>',
//             editorConfig: {
//                 plugins: [ Bold, Essentials, Italic, Mention, Paragraph, Undo ],
//                 toolbar: [ 'undo', 'redo', '|', 'bold', 'italic' ],
//                 licenseKey: '<YOUR_LICENSE_KEY>',
//                 // Other configuration options...
//             }
//         };
//     }
// };
</script>

