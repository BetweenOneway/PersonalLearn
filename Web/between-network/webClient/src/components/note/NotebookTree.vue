<template>
    <div class="div-tree" >
        <n-tree
            class="tree"
            selectable
            :data="notebookTreeMenu"
            :node-props="nodeProps"
            :default-expanded-keys="defaultExpandedKeys"
            block-line
            show-irrelevant-nodes
            :render-label="notebookNode"
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
    import { ref,h,nextTick,computed,watch } from "vue";
    import { NInput } from 'naive-ui'
    
    import { storeToRefs } from 'pinia'
    import { useUserStore } from "@/stores/userStore";

    import noteServerRequest  from "@/request"
    import notebookApi from '@/request/api/notebookApi';
    import noteApi from '@/request/api/noteApi';

    //当前选择笔记本ID
    const currentSelectNotebookId = ref(0);

    const notebookTreeMenu = ref([
        {
            label: "我的文件夹",
            key: "0",
            children: [
            ]
        },
    ]);

    const userStore = useUserStore();
    const {token} = storeToRefs(userStore);

    watch(
        ()=>token.value,
        newData=>{
            //是否重新进行登录
            if(newData !== null)
            {
                //处于加载状态
                loading.value = true;
                //重新获取用户笔记列表
                getNotebookList()
            }
            else{
                console.log("note login invalid")
                loginInvalid(true);
            }
        }
    );

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

                defaultExpandedKeys.value[0] = notebookTreeMenu.value[0].key
                console.log('notebookTreeMenu=>',notebookTreeMenu.value);
                console.log("default expand keys=>",defaultExpandedKeys.value);
            }
        })
    }

    //节点内容渲染函数
    const inputRef = ref(null)

    const notebookNode = ({ option }) => {
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
                        renameNotebook(option.label,option.key)
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
    // const nodesuffix = ({ option }) => {
    //     if (!option.children && option.key == key.value) 
    //     {
    //         return h(
    //             NButton,
    //             {
    //                 text: true,
    //                 type: 'info',
    //                 color: '#00EAFF',
    //                 size: 'tiny',
    //                 onClick: e => {
    //                     //自定义节点删除函数
    //                     //deltree(option.key)
    //                     e.stopPropagation()
    //                 }
    //             },
    //             { default: () => '删除' }
    //         )
    //     } 
    //     else if ((option.children)) 
    //     {
    //         return h(
    //             NButton,
    //             {
    //                 type: 'info',
    //                 color: '#007293',
    //                 bordered: true,
    //                 round: true,
    //                 size: 'tiny',
    //                 textcolor: '#CFFBFF',
    //                 onClick: e => {
    //                     //自定义新增节点函数
    //                     //addnode(e, option.key)
    //                 }
    //             },
    //             { default: () => '+新增' }
    //         )
    //     }
    // }

    //默认打开的菜单KEY
    const defaultExpandedKeys= ref(['my-folder']);

    //右键菜单处理
    let handleSelect = async (key) => {
        contextMenu.value.show = false;
        if(key =='createNotebook')
        {
            currentSelectNotebookId.value = contextMenu.value.notebookKey;
            //新增笔记本
            await addNewNoteBook();
            //重新获取笔记本列表
            await getNotebookList();
        }
        else if(key =='createNote')
        {
            //新增笔记
        }
    };

    let handleClickoutside = () => {
        contextMenu.value.show = false;
    }

    //右键菜单对象
    const contextMenu = ref({
        show:false,
        x:0,//X轴坐标
        y:0,//Y轴坐标
        notebookKey:'',
        options:computed(()=>{
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
        })
    })

    let nodeProps = ({ option }) => {
        return {
            onClick() {
                //单击笔记本
                //对于有子文件夹的文件夹，点击展开按钮并不会触发该事件
                //只有点击文件夹名称才会触发
                console.log("click=>",option.label);
                currentSelectNotebookId.value = option.key;
                //获取当前文件夹下所有笔记
                getNotesList()
            },
            ondblclick() {
                currentSelectNotebookId.value = option.key;
                //双击事件
                option.isedit = true
                nextTick(() => {
                    console.log('ondblclick=>',inputRef);
                    inputRef.value.focus()
                })
            },
            onContextmenu(e) {
                console.log('on contextmenu=>',option)
                currentSelectNotebookId.value = option.key;
                e.preventDefault();
                //contextMenu.value.show = false;
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
     * 新增笔记本
    */
    async function addNewNoteBook(newName="新增笔记本")
    {
        //获取请求API
        let API = {...notebookApi.addNotebook}
        //封装请求体中的参数
        API.data = {
            notebookName:newName,
            parentId:currentSelectNotebookId.value,
        }
        //发送请求
        await noteServerRequest(API).then(responseData =>{
            if(!responseData)
            {
                return;
            }
        })
    }
    
    function addNewNote()
    {

    }

    /**
     * 笔记本重命名
     * @param newName 
     * @param key 
     */
    async function renameNotebook(newName,key)
    {
        //获取请求API
        let API = {...notebookApi.renameNotebook}
        //封装请求体中的参数
        API.data = {
            id:key,
            newName:newName
        }
        //发送请求
        await noteServerRequest(API).then(responseData =>{
            if(!responseData)
            {
                return;
            }
        })
    }

    const emit = defineEmits(['NotebookChanged'])

    function getNotesList()
    {
        console.log("get notes list=>",currentSelectNotebookId.value);
        let API = {...noteApi.getUserNoteList};
        //请求URL的参数
        API.params= {
            notebookId:currentSelectNotebookId.value
        };
        console.log("API=>",API);
        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                emit("NotebookChanged",responseData.data);
            }
        })
    }

    defineExpose({
        addNewNoteBook,
        addNewNote,
        getNotesList
    })

    /**
     * 初始化函数
    */
    function Init()
    {
        getNotebookList();
    }

    Init();
</script>
