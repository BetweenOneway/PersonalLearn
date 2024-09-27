import {
    DecoupledEditor,
    Essentials,
    Paragraph,
    Bold, // 加粗
    Italic, // 斜体
    Strikethrough, // 删除线
    Underline, // 下划线
    Subscript, // 下标
    Superscript, // 上标
    Table, TableToolbar,//表格
    Code, // 行内代码
    BlockQuote,// 块引用插件
    FontSize,FontColor,FontBackgroundColor,
    Alignment,
    HorizontalLine,
    Heading,Title,
    TodoList,ListProperties,
    Indent,IndentBlock,
    CodeBlock,
    FindAndReplace,
    Link,
    Autoformat,
    RemoveFormat,
    Image,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageCaption,
    ImageInsert,
    SimpleUploadAdapter,// 简单图像上传适配器插件
  } from 'ckeditor5'

//编辑器的类型
export const EditorType = DecoupledEditor

//获取富文本编辑器配置
export const getEditorConfigs =()=>({
    plugins:[
        Paragraph,//段落插件
        Essentials,//基础插件
        Bold, // 加粗
        Italic,  // 斜体
        Strikethrough, // 删除线
        Underline, // 下划线
        Superscript, // 上标
        Subscript, // 下标
        Table, TableToolbar,//
        Code, // 行内代码
        BlockQuote,//块引用
        FontSize,//字体大小
        FontColor,//字体颜色
        FontBackgroundColor,//文本背景色
        Alignment,//文本对齐
        HorizontalLine,//水平线
        Heading,//
        //Title,//
        TodoList,//待办事项列表
        ListProperties,//列表(有序和无序)
        Indent,//缩进
        IndentBlock,//块缩进（段落或标题）
        CodeBlock,//代码块
        FindAndReplace,//查找与替换
        Link,//超链接
        Autoformat,//自动格式
        RemoveFormat,//移除格式
        Image,//图像
        ImageToolbar,//图像工具栏
        ImageResize,//图像大小调整
        ImageStyle,//图像样式
        ImageCaption,//图像标题
        ImageInsert,//图像插入
        SimpleUploadAdapter,//简单上传 不能与Base64共用
    ],
    removePlugins: ['Title'],
    fontSize: {
        supportAllValues:true,
        options: [12,14,25,30]
    },
    fontColor:{
        colums:10,
        documentColors:6,
        colors: [
            { color: '#000000', label: '黑色' },
            { color: '#262626', label: '深灰 3' },
            { color: '#585A5A', label: '深灰 2' },
            { color: '#8A8F8D', label: '深灰 1' },
            { color: '#D8DAD9', label: '灰色' },
            { color: '#E7E9E8', label: '浅灰 4' },
            { color: '#EFF0F0', label: '浅灰 3' },
            { color: '#F4F5F5', label: '浅灰 2' },
            { color: '#FAFAFA', label: '浅灰 1' },
            { color: '#FFFFFF', label: '白色' },
        
            { color: '#DF2A3F', label: '红色' },
            { color: '#ED740C', label: '橘橙' },
            { color: '#ECAA04', label: '金盏黄' },
            { color: '#FBDE28', label: '柠檬黄' },
            { color: '#74B602', label: '绿色' },
            { color: '#1DC0C9', label: '青色' },
            { color: '#117CEE', label: '浅蓝' },
            { color: '#2F4BDA', label: '蓝色' },
            { color: '#601BDE', label: '紫色' },
            { color: '#D22D8D', label: '玫红' },
        
            { color: '#FBE4E7', label: '红色 1' },
            { color: '#FDE6D3', label: '橘橙 1' },
            { color: '#F9EFCD', label: '金盏黄 1' },
            { color: '#FBF5CB', label: '柠檬黄 1' },
            { color: '#E8F7CF', label: '绿色 1' },
            { color: '#CEF5F7', label: '青色 1' },
            { color: '#D9EAFC', label: '浅蓝 1' },
            { color: '#D9DFFC', label: '蓝色 1' },
            { color: '#E6DCF9', label: '紫色 1' },
            { color: '#FBDFEF', label: '玫红 1' },
        
            { color: '#F1A2AB', label: '红色 2' },
            { color: '#F8B881', label: '橘橙 2' },
            { color: '#F5D480', label: '金盏黄 2' },
            { color: '#FCE75A', label: '柠檬黄 2' },
            { color: '#C1E77E', label: '绿色 2' },
            { color: '#81DFE4', label: '青色 2' },
            { color: '#81BBF8', label: '浅蓝 2' },
            { color: '#96A7FD', label: '蓝色 2' },
            { color: '#BA9BF2', label: '紫色 2' },
            { color: '#F297CC', label: '玫红 2' },
        
            { color: '#E4495B', label: '红色 3' },
            { color: '#F38F39', label: '橘橙 3' },
            { color: '#F3BB2F', label: '金盏黄 3' },
            { color: '#EDCE02', label: '柠檬黄 3' },
            { color: '#8CCF17', label: '绿色 3' },
            { color: '#01B2BC', label: '青色 3' },
            { color: '#2F8EF4', label: '浅蓝 3' },
            { color: '#4861E0', label: '蓝色 3' },
            { color: '#7E45E8', label: '紫色 3' },
            { color: '#E746A4', label: '玫红 3' },
        
            { color: '#AD1A2B', label: '红色 4' },
            { color: '#C75C00', label: '橘橙 4' },
            { color: '#C99103', label: '金盏黄 4' },
            { color: '#A58F04', label: '柠檬黄 4' },
            { color: '#5C8D07', label: '绿色 4' },
            { color: '#07787E', label: '青色 4' },
            { color: '#0C68CA', label: '浅蓝 4' },
            { color: '#213BC0', label: '蓝色 4' },
            { color: '#4C16B1', label: '紫色 4' },
            { color: '#AE146E', label: '玫红 4' },
        
            { color: '#70000D', label: '红色 5' },
            { color: '#663000', label: '橘橙 5' },
            { color: '#664900', label: '金盏黄 5' },
            { color: '#665800', label: '柠檬黄 5' },
            { color: '#2A4200', label: '绿色 5' },
            { color: '#004347', label: '青色 5' },
            { color: '#00346B', label: '浅蓝 5' },
            { color: '#101E60', label: '蓝色 5' },
            { color: '#270070', label: '紫色 5' },
            { color: '#5C0036', label: '玫红 5' }
        ]
    },
    fontBackgroundColor:{
        colums:10,
        documentColors:6,
        colors: [
            { color: '#000000', label: '黑色' },
            { color: '#262626', label: '深灰 3' },
            { color: '#585A5A', label: '深灰 2' },
            { color: '#8A8F8D', label: '深灰 1' },
            { color: '#D8DAD9', label: '灰色' },
            { color: '#E7E9E8', label: '浅灰 4' },
            { color: '#EFF0F0', label: '浅灰 3' },
            { color: '#F4F5F5', label: '浅灰 2' },
            { color: '#FAFAFA', label: '浅灰 1' },
            { color: '#FFFFFF', label: '白色' },
        
            { color: '#DF2A3F', label: '红色' },
            { color: '#ED740C', label: '橘橙' },
            { color: '#ECAA04', label: '金盏黄' },
            { color: '#FBDE28', label: '柠檬黄' },
            { color: '#74B602', label: '绿色' },
            { color: '#1DC0C9', label: '青色' },
            { color: '#117CEE', label: '浅蓝' },
            { color: '#2F4BDA', label: '蓝色' },
            { color: '#601BDE', label: '紫色' },
            { color: '#D22D8D', label: '玫红' },
        
            { color: '#FBE4E7', label: '红色 1' },
            { color: '#FDE6D3', label: '橘橙 1' },
            { color: '#F9EFCD', label: '金盏黄 1' },
            { color: '#FBF5CB', label: '柠檬黄 1' },
            { color: '#E8F7CF', label: '绿色 1' },
            { color: '#CEF5F7', label: '青色 1' },
            { color: '#D9EAFC', label: '浅蓝 1' },
            { color: '#D9DFFC', label: '蓝色 1' },
            { color: '#E6DCF9', label: '紫色 1' },
            { color: '#FBDFEF', label: '玫红 1' },
        
            { color: '#F1A2AB', label: '红色 2' },
            { color: '#F8B881', label: '橘橙 2' },
            { color: '#F5D480', label: '金盏黄 2' },
            { color: '#FCE75A', label: '柠檬黄 2' },
            { color: '#C1E77E', label: '绿色 2' },
            { color: '#81DFE4', label: '青色 2' },
            { color: '#81BBF8', label: '浅蓝 2' },
            { color: '#96A7FD', label: '蓝色 2' },
            { color: '#BA9BF2', label: '紫色 2' },
            { color: '#F297CC', label: '玫红 2' },
        
            { color: '#E4495B', label: '红色 3' },
            { color: '#F38F39', label: '橘橙 3' },
            { color: '#F3BB2F', label: '金盏黄 3' },
            { color: '#EDCE02', label: '柠檬黄 3' },
            { color: '#8CCF17', label: '绿色 3' },
            { color: '#01B2BC', label: '青色 3' },
            { color: '#2F8EF4', label: '浅蓝 3' },
            { color: '#4861E0', label: '蓝色 3' },
            { color: '#7E45E8', label: '紫色 3' },
            { color: '#E746A4', label: '玫红 3' },
        
            { color: '#AD1A2B', label: '红色 4' },
            { color: '#C75C00', label: '橘橙 4' },
            { color: '#C99103', label: '金盏黄 4' },
            { color: '#A58F04', label: '柠檬黄 4' },
            { color: '#5C8D07', label: '绿色 4' },
            { color: '#07787E', label: '青色 4' },
            { color: '#0C68CA', label: '浅蓝 4' },
            { color: '#213BC0', label: '蓝色 4' },
            { color: '#4C16B1', label: '紫色 4' },
            { color: '#AE146E', label: '玫红 4' },
        
            { color: '#70000D', label: '红色 5' },
            { color: '#663000', label: '橘橙 5' },
            { color: '#664900', label: '金盏黄 5' },
            { color: '#665800', label: '柠檬黄 5' },
            { color: '#2A4200', label: '绿色 5' },
            { color: '#004347', label: '青色 5' },
            { color: '#00346B', label: '浅蓝 5' },
            { color: '#101E60', label: '蓝色 5' },
            { color: '#270070', label: '紫色 5' },
            { color: '#5C0036', label: '玫红 5' }
        ]
    },
    title:{
        placeholder:'请输入标题'
    },
    placeholder:'在此处输入笔记内容',
    image: {
        toolbar: [
            'toggleImageCaption',//图像标题切换
            'resizeImage', // 调整图像尺寸选项
            '|',
            'resizeImage:original', // 原始尺寸
            'resizeImage:25', // 25%
            'resizeImage:50', // 50%
            'resizeImage:75', // 75%
        ]
    },
    simpleUpload: {
        uploadUrl: '/note-server/ckeditor/upload/pic', // 上传图像服务器地址（可能需要解决跨域问题
        // withCredentials: true, // 启用 XMLHttpRequest.withCredentials 属性
        // headers: {
        //     'Accept-Api-Key': 'ASK_D_FF', // 请求头设置来验证身份的（自己定义属性）
        // }
    },
    toolbar: [
        'undo', // 撤消
        'redo', // 重做
        'selectAll', // 全选
        'bold', // 加粗
        'italic', // 斜体
        'strikethrough', // 删除线
        'underline', // 下划线
        'superscript', // 上标
        'subscript', // 下标
        'code', // 行内代码
        'blockquote',
        'FontSize',
        'FontColor',
        'FontBackgroundColor',
        'Alignment',
        'HorizontalLine',
        'Heading',
        'bulletedList',
        'numberedList',
        'todoList',
        'indent',
        'CodeBlock',
        'FindAndReplace',
        'insertTable',
        'Link',
        'RemoveFormat',
        'uploadImage',//图像插入
    ]
})