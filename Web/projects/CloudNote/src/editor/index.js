import {DecoupledEditor} from '@ckeditor/ckeditor5-editor-decoupled';
import {Paragraph} from '@ckeditor/ckeditor5-paragraph'
import {Essentials} from '@ckeditor/ckeditor5-essentials' // 基本功能插件

//编辑器的类型
export const EditorType = DecoupledEditor

//获取富文本编辑器配置
export const getEditorConfigs =()=>({
    plugins:[
        Paragraph,//段落插件
        Essentials,//基础插件
    ],
    toolbar: [
        'undo', // 撤消
        'redo', // 重做
        'selectAll', // 全选
    ]
})