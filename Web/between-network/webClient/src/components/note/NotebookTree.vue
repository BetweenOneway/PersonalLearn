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
            :draggable="true"
            @drop="handleDrop"
            v-model:selected-keys="treeSelectedKeys"
        />
    </div>

    <n-dropdown
      trigger="manual"
      placement="bottom-start"
      :show="contextMenu.show"
      :options="contextMenu.options"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @select="clickContextMenuItem"
      @clickoutside="contextMenuClickoutside"
    />

    <!--删除提醒框-->
    <DeleteRemindDialog @deleteSuccess="deleteNotebookSuccess"></DeleteRemindDialog>
</template>

<script setup>
    import { ref,h,nextTick,computed,watch } from "vue";
    import { NInput } from 'naive-ui'
    
    import DeleteRemindDialog from "../remind/DeleteRemindDialog.vue";

    import { storeToRefs } from 'pinia'
    import { useUserStore } from "@/stores/userStore";

    import { useDeleteRemindDialogStore } from "@/stores/deleteRemindDialogStore";
    const deleteRemindDialogStore = useDeleteRemindDialogStore();
    const {DefaultDeleteRemind} = deleteRemindDialogStore;

    import noteServerRequest  from "@/request"
    import notebookApi from '@/request/api/notebookApi';
    import noteApi from '@/request/api/noteApi';

    import { loginInvalid } from "@/Utils/userLogin";

    //选择笔记本对象
    let currentSelectNode = ref({});
    let prevSelectNode = ref({});
    //树状组件点选项
    let treeSelectedKeys = ref([]);

    const notebookTreeMenu = ref([
        {
            label: "我的文件夹",
            key: -1,
            children: [
            ]
        },
    ]);

    function resetNotebookTreeMenu()
    {
        notebookTreeMenu.value =[
            {
                label: "我的文件夹",
                key: -1,
                children: [
                ]
            },
        ];
    }

    function FindNotebookByKey(startNode,key)
    {
        if(startNode.key == key)
        {
            return startNode;
        }
        else if(0 != (startNode?.children?.length ?? 0))
        {
            for(var childNode of startNode.children)
            {
                let findResult = FindNotebookByKey(childNode,key);
                if(!!findResult)
                {
                    return findResult;
                }
            }
        }
        return undefined;
    }

    const userStore = useUserStore();
    const {token} = storeToRefs(userStore);

    //是否处于加载状态
    const loading = ref(false)

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
    function getNotebookList(targetKey = -1)
    {
        noteServerRequest(notebookApi.getNotebookList).then(responseData=>{
            if(responseData)
            {
                loading.value = false;
                //清空旧有笔记本列表
                resetNotebookTreeMenu();
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
                        key: notebook.id,
                        isedit:false,
                        level:notebook.level,
                        parent_id:notebook.parent_id,
                        index:notebook.index,
                    })
                }
                console.log('notebookmap=>',notebookMap);
                //将低级菜单对象并入高级菜单对象 保留顶级菜单
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
                //如果有选择节点，则更新选择节点
                if(!!currentSelectNode.value?.key)
                {                
                    if(targetKey != -1)
                    {
                        currentSelectNode.value = notebookMap.get(targetKey);
                    }
                    else{
                        currentSelectNode.value = notebookTreeMenu.value[0];
                    }
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

    //默认展开笔记本
    
    const defaultExpandedKeys= ref([currentSelectNode.value?.key??-1]);

    //右键菜单处理
    let clickContextMenuItem = async (key) => {
        contextMenu.value.show = false;
        console.log("click context menu item currentSelectNode=>",currentSelectNode.value);
        if(key =='createNotebook')
        {
            //新增笔记本
            await addNewNoteBook();
            //重新获取笔记本列表
            await getNotebookList();
        }
        else if(key =='createNote')
        {
            //新增笔记
            addNewNote();
        }
        else if(key =='deleteNotebook')
        {
            let toDeleteNotebook = currentSelectNode.value;
            currentSelectNode.value = {};
            //删除笔记本
            DefaultDeleteRemind({
                id:toDeleteNotebook.key,
                title:toDeleteNotebook.label,
                type:2
            })
        }
    };

    let contextMenuClickoutside = () => {
        contextMenu.value.show = false;
    }

    //右键菜单对象
    const contextMenu = ref({
        show:false,
        x:0,//X轴坐标
        y:0,//Y轴坐标
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
                ,
                {
                    label:'删除笔记本',
                    key:'deleteNotebook',
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
                console.log("click=>",option);
                prevSelectNode.value = currentSelectNode.value;
                currentSelectNode.value = option;
                //获取当前文件夹下所有笔记
                getNotesList(false);
            },
            ondblclick() {
                currentSelectNode.value = option;
                prevSelectNode.value = currentSelectNode.value;
                //双击事件
                option.isedit = true
                nextTick(() => {
                    console.log('ondblclick=>',inputRef);
                    inputRef.value.focus()
                })
            },
            onContextmenu(e) {
                console.log('on contextmenu=>',option)
                currentSelectNode.value = option;
                prevSelectNode.value = currentSelectNode.value;
                e.preventDefault();
                //contextMenu.value.show = false;
                nextTick().then(() => {
                    contextMenu.value.show = true;
                    contextMenu.value.x = e.clientX;
                    contextMenu.value.y = e.clientY;
                });
            }
        };
    }

    /**
     * 新增笔记本
    */
    async function addNewNoteBook(newName="新增笔记本")
    {
        console.log("add new notebook,parentId=>",currentSelectNode.value.key)
        //获取请求API
        let API = {...notebookApi.addNotebook}
        //封装请求体中的参数
        API.data = {
            notebookName:newName,
            parentId:currentSelectNode.value.key,
            index:(currentSelectNode.value?.children?.length)??0,
            level:currentSelectNode.value.level + 1,
        }
        //发送请求
        await noteServerRequest(API).then(responseData =>{
            if(responseData)
            {
                //新增笔记本成功重新获取笔记本列表
                console.log("after add notebook,reload notebook list");
                getNotebookList()
            }
            
        })
    }

    /**
     * 删除笔记本成功回调
     */
    function deleteNotebookSuccess()
    {
        console.log("NotebookTree==>deleteNotebookSuccess")
        //重新获取笔记本列表
        getNotebookList();
    }

    /**
     * 新建笔记
     */
    function addNewNote()
    {
        console.log("create note=>",currentSelectNode.value);
        let API = {...noteApi.createNote};
        //请求URL的参数
        API.params= {
            notebookId:currentSelectNode.value.key
        };
        console.log("API=>",API);
        noteServerRequest(API).then(responseData=>{
            console.log("create responseData=>",responseData);
            if(responseData?.success)
            {
                //重新获取笔记列表
                getNotesList();
            }
        })
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

    function getRecentNoteList()
    {
        noteServerRequest(noteApi.getRecentNoteList).then(responseData=>{
            if(responseData)
            {
                emit("NotebookChanged",responseData.data);
            }
        })
    }

    /**
     * @param force[Boolean] 是否强制获取所有笔记
     */
    function getNotesList(force = true)
    {
        console.log("get Notes list prevSelectNode=>",prevSelectNode.value)
        console.log("currentSelectNode=>",currentSelectNode.value);
        if(!force)
        {
            //重复点选同一文件夹，不发送请求
            if(!!prevSelectNode.value?.key && 
            prevSelectNode.value.key == currentSelectNode.value.key)
            {
                return;
            }
        }

        if(!currentSelectNode.value.key)
        {
            console.log("currentSelectNode.value.key=>",currentSelectNode.value.key);
            getRecentNoteList();
        }
        else
        {
            let API = {...noteApi.getUserNoteList};
            //请求URL的参数
            API.params= {
                notebookId:currentSelectNode.value.key
            };
            console.log("get notes list API=>",API);
            noteServerRequest(API).then(responseData=>{
                if(responseData)
                {
                    emit("NotebookChanged",responseData.data);
                }
            })
        }
    }

    //获取回收站中笔记列表
    function getRecycleNoteList()
    {
        console.log("get notes list=>",currentSelectNode.value);
        let API = {...noteApi.getUserNoteList};
        //请求URL的参数
        API.params= {
            notebookId:currentSelectNode.value.key
        };
        console.log("API=>",API);
        noteServerRequest(API).then(responseData=>{
            if(responseData)
            {
                emit("NotebookChanged",responseData.data);
            }
        })
    }

    /**
     * 处理拖拽改变笔记本关系
    */
    async function changeNotebookRelation(dragNode,node,dropPosition)
    {
        let newParentId = -1;
        let newLevel = 0;
        
        let notebooks = [
        ];

        if(dropPosition == "inside")
        {
            //此时节点为父节点
            if(dragNode.parent_id == node.key)
            {
                return;
            }
            notebooks.push(
                {
                    id:dragNode.key,
                    parent_id:node.key,
                    level:node.level+1,
                    index:node?.children.length??0,
                }
            )
        }
        else
        {
            //此时节点为同级子节点
            if(dragNode.parent_id == node.parent_id)
            {
                return;
            }

            let parentNotebook = FindNotebookByKey(notebookTreeMenu.value[0],node.parent_id);
            if(!!!parentNotebook)
            {
                console.log("can not find parent notebook=>",node.parent_id);
                return;
            }

            if(dropPosition == "before")
            {
                notebooks.push({
                    id:dragNode.key,
                    parent_id:node.parent_id,
                    level:node.level,
                    index:node.index,
                });

                for(var notebook of parentNotebook.children)
                {
                    if(notebook.index >= node.index)
                    {
                        notebooks.push({
                            id:notebook.key,
                            index:notebook.index+1,
                        });
                    }
                }
            }
            else if(dropPosition == "after")
            {
                var newIndex = node.index + 1;
                notebooks.push({
                    id:dragNode.key,
                    parent_id:node.parent_id,
                    level:node.level,
                    index:newIndex,
                });

                for(var notebook of parentNotebook.children)
                {
                    if(notebook.index >= newIndex)
                    {
                        notebooks.push({
                            id:notebook.key,
                            index:notebook.index+1,
                        });
                    }
                }
            }
        }

        console.log("to update notebook list=>",notebooks);
        //发送请求，更改层级关系
        //获取请求API
        let API = {...notebookApi.updateNotebookRelation}
        //封装请求体中的参数
        API.data = {
            notebookList:notebooks
        }
        //发送请求
        await noteServerRequest(API).then(responseData =>{
            if(responseData)
            {
                //更改笔记本关系成功重新获取笔记本列表
                console.log("after add notebook,reload notebook list");
                getNotebookList(dragNode.key)
                //本地直接更新？重新获取？
                //removeNode(dragNode.key); // 先移除拖拽节点
                //insertNode(node.key, dragNode, dropPosition); // 再插入到新位置
            }
            
        })
    }

    /**
     * 处理拖拽事件
     * @param {Object} info - 拖拽信息
     */
     const handleDrop = (info) => {
        console.log("handle drop info=>",info);
        const { node, dragNode, dropPosition } = info;

        // 打印调试信息
        console.log('Dragged Node:', dragNode);
        console.log('Target Node:', node);
        console.log('Drop Position:', dropPosition);

        changeNotebookRelation(dragNode,node,dropPosition)
    };

    /**
     * 移除指定节点
     * @param {string} key - 节点的 key
     */
    const removeNode = (key) => {
      const findAndRemove = (data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            data.splice(i, 1);
            return true;
          }
          if (data[i].children) {
            if (findAndRemove(data[i].children)) {
              return true;
            }
          }
        }
        return false;
      };
      findAndRemove(datatree.value);
    };

    /**
     * 插入节点到指定位置
     * @param {string} targetKey - 目标节点的 key
     * @param {Object} dragNode - 拖拽节点
     * @param {number} position - 插入位置（before: 前面, inside: 子节点, after: 后面）
     */
    const insertNode = (targetKey, dragNode, position) => {
      const findAndInsert = (data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === targetKey) {
            if (position === "inside") {
              // 插入为子节点
              if (!data[i].children) {
                data[i].children = [];
              }
              data[i].children.push(dragNode);
            } else {
              // 插入到兄弟节点的位置
              const index = position === "before" ? i : i + 1;
              data.splice(index, 0, dragNode);
            }
            return true;
          }
          if (data[i].children) {
            if (findAndInsert(data[i].children)) {
              return true;
            }
          }
        }
        return false;
      };
      findAndInsert(notebookTreeMenu.value);
    };

    function ClearSelectNode()
    {
        prevSelectNode.value = {};
        currentSelectNode.value = {};
        console.log("Clear Prev Select Node =>",prevSelectNode.value);
        treeSelectedKeys.value=[];
    }

    defineExpose({
        addNewNoteBook,
        addNewNote,
        getNotesList,
        getRecycleNoteList,
        ClearSelectNode
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
