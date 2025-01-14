<template>
    <div class="input-div">
        <n-space justify="center">
            <n-button type="primary">新建</n-button>
        </n-space>
    </div>
    <div class="div-tree" >
        <n-tree
            class="tree"
            selectable
            :data="notebookTreeMenu"
            :node-props="nodeProps"
            :render-switcher-icon="renderSwitcherIcon"
            :default-expand-keys="defaultExpandedKeys"
            block-line
            show-irrelevant-nodes
            :render-label="nodelabel"
            :render-suffix="nodesuffix"
        />
    </div>

    <n-dropdown
      trigger="manual"
      placement="bottom-start"
      :show="contextMenu.show"
      :options="contextMenu.options"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @select="handleSelect"
      @clickoutside="handleClickoutside"
    />
</template>
  
<script setup>
    import { ref,h,nextTick } from "vue";
    import { NButton,NInput } from 'naive-ui'
    import noteServerRequest  from "@/request"
    import notebookApi from '@/request/api/notebookApi';

    const notebookTreeMenu = ref([
        {
            label: "我的文件夹",
            key: "my-folder",
            children: [
            ]
        },
    ]);
    /**
     * 获取用户笔记本列表
    */
    function getNotebookList()
    {
        noteServerRequest(notebookApi.getNotebookList).then(responseData=>{
            if(responseData)
            {
                let allNotebook = responseData.data;
                console.log("all notebook=>",allNotebook);
                if(allNotebook.length <=0)
                {
                    return;
                }
                var notebookMap = new Map();
                //依次创建所有菜单对象
                for(let notebook of allNotebook)
                {
                    notebookMap.set(notebook.id,{
                        label: notebook.name,
                        key: ''+notebook.id,
                        isedit:false,
                    })
                }
                console.log('notebookmap=>',notebookMap);
                //将低级菜单对象并入高级菜单对象
                for(let notebook of allNotebook)
                {
                    //获取当前菜单对象
                    let curNotebook = notebookMap.get(notebook.id);
                    //获取父级菜单对象
                    let parentNotebook = notebookMap.get(notebook.parent_id);
                    if(!!parentNotebook)
                    {
                        if(!!parentNotebook.children)
                        {
                            parentNotebook.children.push(curNotebook);
                        }
                        else{
                            parentNotebook.children = [curNotebook]
                        }

                        //移除当菜单对象
                        notebookMap.delete(notebook.id);
                        notebookMap.set(notebook.parent_id,parentNotebook)
                    }
                }

                //此时nootebookMap中应该只有一级菜单对象
                for(let level1Notebook of notebookMap)
                {
                    notebookTreeMenu.value[0].children.push(level1Notebook[1]);
                }

                console.log('notebookTreeMenu=>',notebookTreeMenu.value);
            }
        })
    }

    //节点内容渲染函数
    const inputRef = ref(null)

    const nodelabel = ({ option }) => {
        //  console.log(option.key)
        return h(
            'div',
            { 
                class: 'node', 
                style: { width: '5rem' }
            },
            (option.isedit == true)
            ? h(NInput, 
                {
                    autofocus: true,
                    ref: inputRef,
                    size: 'small',
                    value: option.label,
                    onUpdateValue: v => {
                        option.label = v
                    },
                    onChange: () => {
                        console.log("option change=>",option.key);
                        option.isedit = false
                        //更新笔记本名称
                    },
                    onBlur: () => {
                        console.log("option blur=>",option.key);
                        option.isedit = false
                    }
                }
            )
            : option.label
        )
    }

    //节点后缀渲染
    const nodesuffix = ({ option }) => {
        if (!option.children && option.key == key.value) 
        {
            return h(
                NButton,
                {
                    text: true,
                    type: 'info',
                    color: '#00EAFF',
                    size: 'tiny',
                    onClick: e => {
                        //自定义节点删除函数
                        //deltree(option.key)
                        e.stopPropagation()
                    }
                },
                { default: () => '删除' }
            )
        } 
        else if ((option.children)) 
        {
            return h(
                NButton,
                {
                    type: 'info',
                    color: '#007293',
                    bordered: true,
                    round: true,
                    size: 'tiny',
                    textcolor: '#CFFBFF',
                    onClick: e => {
                        //自定义新增节点函数
                        //addnode(e, option.key)
                    }
                },
                { default: () => '+新增' }
            )
        }
    }

    let defaultExpandedKeys= ref(['my-folder']);

    //右键菜单处理
    let handleSelect = (key) => {
        contextMenu.value.show = false;
        if(key =='createNotebook')
        {
            addNewNoteBook(contextMenu.value.notebookKey);
        }
        else if(key =='createNote')
        {}
    };

    let handleClickoutside = () => {
        contextMenu.value.show = false;
    }

    function addNewNoteBook(parent_id)
    {

    }

    //右键菜单对象
    const contextMenu = ref({
        show:false,
        x:0,//X轴坐标
        y:0,//Y轴坐标
        notebookKey:'',
        options:()=>{
            return [
                {
                    label:'新建笔记本',
                    key:'createNotebook',
                },
                {
                    label:'新建笔记',
                    key:'createNote',
                }
            ]
        }
    })

    let nodeProps = ({ option }) => {
        return {
            onClick() {
                //单击笔记本
            },
            ondblclick() {
                //双击事件
                option.isedit = true
                nextTick(() => {
                    console.log('ondblclick=>',inputRef);
                    inputRef.value.focus()
                })
            },
            onContextmenu(e) {
                e.preventDefault();
                contextMenu.value.show = false;
                nextTick().then(() => {
                    contextMenu.value.show = true;
                    contextMenu.value.x = e.clientX;
                    contextMenu.value.y = e.clientY;
                    contextMenu.value.notebookKey = option.key;
                    contextMenu.value.notebookLabel = option.label;
                });
            }
        };
    }

    /**
     * 初始化函数
    */
    function Init()
    {
        getNotebookList();
    }

    Init();
</script>
