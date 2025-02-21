<template>
    <div style="position: relative; width: 100%; height: 100%;">
   
      <!-- ------- markdown组件容器 --------- -->
      <div ref="markdownContainerRef" :id="mdId" class="cherry_container scroll"
        :style="{ 'left': toc_Visiable ? '262px' : '0px' }" @scroll="onScroll">
      </div>
    </div>
  </template>
   
  <script setup>
  import { ref, onMounted, onBeforeMount, watch, onBeforeUnmount, toRefs, reactive, nextTick } from 'vue';
  import Axios from 'axios';
  import 'cherry-markdown/dist/cherry-markdown.css';
  import Cherry from 'cherry-markdown'
  // import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
  import * as echarts from "echarts";
  import CherryMermaidPlugin from 'cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin';
  import mermaid from 'mermaid';
  // 组件传值
  const props = defineProps({
    // markdown文本
    markDownConent: {
      type: String,
      default: '',
    },
    // markdown组件容器ID
    mdId: {
      type: String,
      default: 'markdownContainer',
    },
    // 编辑器的显示模式 view|edit
    displayModal: {
      type: String,
      default: 'view',
    },
    // 用来控制目录显示或隐藏
    tocVisiable: {
      type: Boolean,
      default: true,
    },
   
  });
  const emit = defineEmits(['input', 'md-change']);
  const { mdId, displayModal, tocVisiable, markDownConent } = toRefs(props);
   
   
  // 组件内部变量
  const content = ref('');
  const markdownContainerRef = ref(null); //dom 元素
  const markDown_Conent = ref('');
  const toc_Visiable = ref(tocVisiable.value); //目录 显隐
  const cherrInstance = ref(null); //Cherry MarkDown实例
   
  const initCherryMD = async (value) => {
    markDown_Conent.value = value || markDownConent.value;
    cherrInstance.value = new Cherry({
      id: mdId.value,
      value: markDown_Conent.value,
      externals: {
        echarts: echarts,
      },
      fileUpload,
      callback: {
        //changeString2Pinyin: pinyin,
        // afterChange,
        afterInit,
        beforeImageMounted,
        onClickPreview: function (e) {
          const { target } = e;
          if (target.tagName === 'IMG') {
            console.log('click img', target);
            const tmp = new Viewer(target, {
              button: false,
              navbar: false,
              title: [1, (image, imageData) => `${image.alt.replace(/#.+$/, '')} (${imageData.naturalWidth} × ${imageData.naturalHeight})`],
              hidden() {
                tmp.destroy()
              },
            });
            tmp.show();
          }
        }
      },
      toolbars: {
        showToolbar:displayModal.value=="previewOnly"?false:true,
        toolbar: ['bold', 'italic', 'strikethrough', '|', 'color', 'header', 'ruby', '|', 'list', 'panel', 'detail'],
        // 定义侧边栏，默认为空
        sidebar: [],
        // 定义顶部右侧工具栏，默认为空
        toolbarRight: [],
        // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
        bubble: false,
        // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
        float: false,
        // 定义顶部工具栏
        toolbar: [
          'bold',
          'italic',
          {
            strikethrough: ['strikethrough', 'underline', 'sub', 'sup', 'ruby', 'boldAndItalicName'],
          },
          'size',
          '|',
          'color',
          'header',
          '|',
          'ol',
          'ul',
          'checklist',
          'panel',
          'justify',
          'detail',
          '|',
          'formula',
          {
            insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word', 'ruby'],
          },
          'graph',
          'togglePreview',
          'settings',
          'codeTheme',
          'export',
          // {
          //   customMenuBName: ['ruby', 'audio', 'video', 'boldAndItalicName'],
          // },
          // 'customMenuCName',
          'theme',
        ],
        // 定义侧边栏，默认为空
        sidebar: ['mobilePreview', 'copy', 'theme'],
        // 定义顶部右侧工具栏，默认为空
        toolbarRight: ['fullScreen', '|'],
   
        // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
        bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', 'ruby', '|', 'size', 'color'], // array or false
        showToolbar: true,
        // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
        // float: false,
        toc: {
          updateLocationHash: false, // 要不要更新URL的hash
          defaultModel: 'full', // pure: 精简模式/缩略模式，只有一排小点； full: 完整模式，会展示所有标题
        },
        customMenu: {
          boldAndItalicName: boldAndItalic,
          customMenuBName: customMenuB,
          customMenuCName: customMenuC,
        },
      },
   
      editor: {
        id: `${mdId.value}editor`,
        name: 'cherry-text',
        autoSave2Textarea: true,
        defaultModel: displayModal.value,
      },
      previewer: {
        // 自定义markdown预览区域class
        // className: 'markdown'
      },
      // 预览页面不需要绑定事件
      isPreviewOnly: false,
      // 预览区域跟随编辑器光标自动滚动
      autoScrollByCursor: true,
      // 外层容器不存在时，是否强制输出到body上
      forceAppend: true,
      // The locale Cherry is going to use. Locales live in /src/locales/
      locale: 'zh_CN',
      keydown: [],
   
      // cherry初始化后是否检查 location.hash 尝试滚动到对应位置
      autoScrollByHashAfterInit: false,
    });
  };
   
   
   
   
   
  /**
   * 自定义一个自定义菜单
   * 点第一次时，把选中的文字变成同时加粗和斜体
   * 保持光标选区不变，点第二次时，把加粗斜体的文字变成普通文本
   */
  const boldAndItalic = Cherry.createMenuHook('加粗斜体', {
    iconName: 'font',
    onClick: function (selection) {
      // 获取用户选中的文字，调用getSelection方法后，如果用户没有选中任何文字，会尝试获取光标所在位置的单词或句子
      let $selection = this.getSelection(selection) || '同时加粗斜体';
      // 如果是单选，并且选中内容的开始结束内没有加粗语法，则扩大选中范围
      if (!this.isSelections && !/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
        this.getMoreSelection('***', '***', () => {
          const newSelection = this.editor.editor.getSelection();
          const isBoldItalic = /^\s*(\*\*\*)[\s\S]+(\1)/.test(newSelection);
          if (isBoldItalic) {
            $selection = newSelection;
          }
          return isBoldItalic;
        });
      }
      // 如果选中的文本中已经有加粗语法了，则去掉加粗语法
      if (/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
        return $selection.replace(/(^)(\s*)(\*\*\*)([^\n]+)(\3)(\s*)($)/gm, '$1$4$7');
      }
      /**
       * 注册缩小选区的规则
       *    注册后，插入“***TEXT***”，选中状态会变成“***【TEXT】***”
       *    如果不注册，插入后效果为：“【***TEXT***】”
       */
      this.registerAfterClickCb(() => {
        this.setLessSelection('***', '***');
      });
      return $selection.replace(/(^)([^\n]+)($)/gm, '$1***$2***$3');
    }
  });
  /**
   * 定义一个空壳，用于自行规划cherry已有工具栏的层级结构
   */
  const customMenuB = Cherry.createMenuHook('实验室', {
    iconName: '',
  });
  /**
   * 定义一个自带二级菜单的工具栏
   */
  const customMenuC = Cherry.createMenuHook('帮助中心', {
    iconName: 'question',
    onClick: (selection, type) => {
      switch (type) {
        case 'shortKey':
          console.log("🚀 ~ selection:", selection)
          return `${selection}快捷键看这里：https://codemirror.net/5/demo/sublime.html`;
        case 'github':
          return `${selection}我们在这里：https://github.com/Tencent/cherry-markdown`;
        case 'release':
          return `${selection}我们在这里：https://github.com/Tencent/cherry-markdown/releases`;
        default:
          return selection;
      }
    },
    subMenuConfig: [
      { noIcon: true, name: '快捷键', onclick: (event) => { cherrInstance.value.toolbar.menus.hooks.customMenuCName.fire(null, 'shortKey') } },
      { noIcon: true, name: '联系我们', onclick: (event) => { cherrInstance.value.toolbar.menus.hooks.customMenuCName.fire(null, 'github') } },
      { noIcon: true, name: '更新日志', onclick: (event) => { cherrInstance.value.toolbar.menus.hooks.customMenuCName.fire(null, 'release') } },
    ]
  });
   
  const fileUpload = (file) => {
    var formData = new FormData();
    formData.append("file", file);
    Axios.post("/api/common/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    }).then((response) => {
      if (response.code == 0) {
        let imgMdStr = `![${response.data.file_name}](${response.data.ref_url})`;
        console.log(imgMdStr);
        cherrInstance.value.insert(imgMdStr);
      }
    });
  };
   
  const afterChange = (e) => {
    content.value = e;
    // getTitles();
    // const mdHtml = getCherryMarkdownHtml();
    // const mdTxt = e;
    // const mdContent = getCherryMarkdownContent();
    // emit('input', mdContent);
    // emit('md-change', mdHtml, mdTxt, mdContent);
  };
   
  // 初始化事件回调
  const afterInit = (e) => {
    //console.log(e)
  };
   
  // 图片加载回调
  const beforeImageMounted = (e, src) => {
    //console.log('bfImageMt', e, src)
    return {
      [e]: src
    };
  };
   
  /**
   * 设置markdown编辑器内容，全部覆盖
   * @param {Object} content 要设置的内容
   * @param {Object} keepCursor 自动设置焦点到内容
   */
  const setMarkdown = (content, keepCursor) => {
    if (!cherrInstance.value) {
      initCherryMD(content);
      return;
    }
    // setMarkdown(content:string, keepCursor = false)
    cherrInstance.value.setMarkdown(content, keepCursor);
  };
  const setValue = (content) => {
    if (!cherrInstance.value) {
      initCherryMD(content);
      return;
    }
    // setValue(content:string, keepCursor = false)
    cherrInstance.value.setValue(content);
  };
   
   
   
  const getCherryMarkdownContent = () => {
    const result = cherrInstance.value.getMarkdown();// 获取markdown内容
    return result;
  };
  const getCherryMarkdownHtml = () => {
    const result = cherrInstance.value.getHtml();
    return result;
  };
   
   
   
  /**
   * @description: MarkDown转出'pdf'|'img'
   * @param {string} type：{'pdf'|'img'}
   * @return {*}
   */
  const exportMD = (type = 'pdf') => {
    cherrInstance.value.export(type);
  };
   
  /**
   * model{'edit&preview'|'editOnly'|'previewOnly'}
   */
  const switchModel = (model) => {
    if (isInit()) {
      cherrInstance.value.switchModel(model);
    }
  };
  const isInit = () => {
    if (cherrInstance.value) {
      return true;
    }
    console.warning('编辑器未初始化，请检查');
    return false;
  };
   
   
  const insert = (content, isSelect = false, anchor = [], focus = true) => {
    console.log(content);
    cherrInstance.value.insert(content, isSelect, anchor, focus);
  };
   
   
   
   
   
  const toc_List = ref([]); //存放目录
  // 获取目录
  const getTitles = () => {
    toc_List.value = cherrInstance.value.getToc();
  };
   
  // // 自定义目录相关
  // const curTab = ref(0);
  // // 调用获取目录
  // const showToc = (val) => {
  //   if (val) {
  //     getTitles();
  //   }
  //   toc_Visiable.value = val;
  // };
   
  // // 目录的定位滚动
  // let scrollObj = reactive({
  //   distance: 0,
  //   totalY: 0,
  //   step: 0,
  // })
  // const jump = (index) => {
  //   curTab.value = index;
  //   let anchorName = toc_List.value[index].id;
  //   let anchorElem = document.getElementById(anchorName);
  //   let firstElem = document.getElementById(toc_List.value[0].id);
   
  //   scrollObj.totalY = anchorElem.offsetTop - firstElem.offsetTop;
  //   scrollObj.distance = document.querySelector('.cherry-previewer').scrollTop;
  //   scrollObj.step = scrollObj.totalY / 50;
  //   if (scrollObj.totalY > scrollObj.distance) {
  //     smoothDown(document.querySelector('.cherry-previewer'));
  //   } else {
  //     let newTotal = scrollObj.distance - scrollObj.totalY;
  //     scrollObj.step = newTotal / 50;
  //     smoothUp(document.querySelector('.cherry-previewer'));
  //   }
  // };
   
  // const smoothDown = (element) => {
  //   if (scrollObj.distance < scrollObj.totalY) {
  //     scrollObj.distance += scrollObj.step;
  //     element.scrollTop = scrollObj.distance;
  //     setTimeout(smoothDown.bind(this, element), 2);
  //   } else {
  //     element.scrollTop = scrollObj.totalY;
  //   }
  // };
   
  // const smoothUp = (element) => {
  //   if (scrollObj.distance > scrollObj.totalY) {
  //     scrollObj.distance -= scrollObj.step;
  //     element.scrollTop = scrollObj.distance;
  //     setTimeout(smoothUp.bind(this, element), 2);
  //   } else {
  //     element.scrollTop = scrollObj.totalY;
  //   }
  // };
   
  // const onScroll = (e) => {
  //   getTitles();
  //   if (!toc_List.value || toc_List.value.length < 1) return;
   
  //   let firstElem = document.getElementById(toc_List.value[0].id);
   
  //   for (let i = toc_List.value.length - 1; i >= 0; i--) {
  //     let anchorElem = document.getElementById(toc_List.value[i].id);
   
  //     let judge = e.target.scrollTop >= anchorElem.offsetTop - firstElem.offsetTop;
   
  //     if (judge) {
  //       curTab.value = i;
  //       break;
  //     }
  //   }
  // };
   
   
   
   
  onBeforeUnmount(() => {
    destroyInstance()
  });
   
  onBeforeMount(async () => {
    // 插件注册必须在Cherry实例化之前完成
    await Cherry.usePlugin(CherryMermaidPlugin, {
      mermaid, // 传入mermaid引用
      // mermaidAPI: mermaid.mermaidAPI, // 也可以传入mermaid API
      // 同时可以在这里配置mermaid的行为，可参考mermaid官方文档
      // theme: 'neutral',
      // sequence: { useMaxWidth: false, showSequenceNumbers: true }
    });
  });
   
  onMounted(() => {
    initCherryMD()
  });
   
  watch(
    () => props.markDownConent,
    async (newValue, oldValue) => {
      markDown_Conent.value = newValue
      if (cherrInstance.value) {
        await destroyInstance();
      }
      await initCherryMD(newValue)
      // if (displayModal.value === 'edit') {
      //   nextTick(() => {
      //     cherrInstance.value.setMarkdown(newValue, 1);
      //   })
      // }
   
      // 自定义目录相关
      // showToc(toc_Visiable.value);   
    },
    // { immediate: true }
  )
   
   
  const destroyInstance = (val) => {
    // cherrInstance.value.destroy()
    while (markdownContainerRef.value.firstChild) {
      markdownContainerRef.value.removeChild(markdownContainerRef.value.firstChild);
    }
    cherrInstance.value = null;
  };
   
  // 使用defineExpose暴露给父组件
  defineExpose({
    // 可以暴露更多变量或方法
    initCherryMD,
    setMarkdown,
    setValue,
  })
   
  </script>
   
 <style scoped>
  .cherry_container {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
  }
   
  .toc_container {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    width: 260px;
    background-color: #fff;
  }
   
  .toc_container .toc_header {
      height: 48px;
      line-height: 48px;
      background-color: #20304b;
      text-align: center;
      font-size: 16px;
      color: #fff;
    }
   
    .toc_container .toc_list {
      position: absolute;
      top: 60px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      overflow: auto;
   
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
   
      &::-webkit-scrollbar-thumb {
        background-color: #607d8b;
        border-radius: 5px;
      }
   
      &::-webkit-scrollbar-thumb:hover {
        background: #40a0ff;
      }
   
      .toc_list_container {
        padding-top: 6px;
        cursor: pointer;
      }
   
      .toc_list_container:hover {
        color: red;
      }
    }
   
  .top-contrl {
    position: absolute;
    top: 10px;
    right: 8px;
    height: 30px;
    padding-right: 5px;
    color: red;
    font-weight: bold;
    font-size: 20px;
    z-index: 2;
  }
  </style>