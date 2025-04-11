<template>
    <div class="input-div">
      <n-space justify="center">
        <n-input
          v-model:value="pattern"
          size="small"
          class="input"
          placeholder="按名称查询"
        ></n-input>
      </n-space>
    </div>
    <div class="div-tree" >
      <n-tree
        class="tree"
        selectable
        :pattern="pattern"
        :data="datatree"
        :node-props="checkCamera"
        :render-switcher-icon="renderSwitcherIcon"
        default-expand-all
        block-line
        show-irrelevant-nodes
        :render-label="nodelabel"
        :render-suffix="nodesuffix"
        :draggable="true"
        @drop="handleDrop"
      />
    </div>
</template>

<script setup>
    import { ref,h,nextTick } from "vue";
    import { NButton,NInput } from 'naive-ui'

    let datatree = ref([
        {
            label:'语文',
            key:'01',
            isedit:false,
            children:[
                {
                    label:'一年级',
                    key:'0111',
                    isedit:false,
                },
                {
                    label:'二年级',
                    key:'0112',
                    isedit:false,
                }
            ]
        },
        {
            label:'数学',
            key:'02',
            isedit:false,
            children:[
                {
                    label:'三年级',
                    key:'0211',
                    isedit:false,
                },
                {
                    label:'四年级',
                    key:'0212',
                    isedit:false,
                }
            ]
        }
    ]);

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
                        //每一次输入都会出发
                        console.log("option update=>",option.key);
                        option.label = v
                    },
                    //两个是一样的 这两个只有回车或者输入交点离开时才会触发
                    onChange: () => {
                        //只有值改变时才会触发
                        console.log("option change=>",option.key);
                        option.isedit = false
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
                        addNode(e, option.key)
                    }
                },
                { default: () => '+新增' }
            )
        }
    }

    const key = ref()
    //节点点击事件
    const checkCamera = ({ option }) => {
        return {
            onClick() {
                //emits('optionlabel', option.label)
                //console.log(option.label)
                key.value = option.key
            },
            ondblclick() {
                //双击事件
                option.isedit = true
                nextTick(() => {
                    console.log('ondblclick=>',inputRef);
                    inputRef.value.focus()
                })
            }
        }
    }

    function addNode(e,key)
    {
        console.log("add node=>",key);
        const getNode = (key,rootNode)=>{
            for(var node of rootNode)
            {
                if(node.key == key)
                {
                    return node;
                }
                else if(!node.children?.length)
                {
                    var result =getNode(key,node.children);
                    if(!!result)
                    {
                        return result;
                    }
                }
            }
            return null;
        }
        let targetNode = getNode(key,datatree.value);
        console.log("foud node",targetNode);
        if(!!targetNode?.children.length)
        {
            let notebookId = targetNode.children.length;
            targetNode.children.push({
                label:'新笔记本',
                key:targetNode.key+notebookId,
                isedit:true,
            })
        }
        else{
            targetNode.children=[{
                label:'新笔记本',
                key:targetNode.key+'0',
                isedit:true,
            }]
        }
        console.log("added node",targetNode);


        let obj ={
            name:'wang',
            family:'wei'
        }
        console.log("obj=>",obj);
    }

    /**
     * 处理拖拽事件
     * @param {Object} info - 拖拽信息
     */
     const handleDrop = (info) => {
      const { node, dragNode, dropPosition } = info;

      // 打印调试信息
      console.log('Dragged Node:', dragNode);
      console.log('Target Node:', node);
      console.log('Drop Position:', dropPosition);

      // 在这里实现你的逻辑，比如修改 datatree 的结构
      // 示例：将拖拽节点插入到目标节点的指定位置

      removeNode(dragNode.key); // 先移除拖拽节点
      insertNode(node.key, dragNode, dropPosition); // 再插入到新位置
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
     * @param {number} position - 插入位置（-1: 前面, 0: 子节点, 1: 后面）
     */
    const insertNode = (targetKey, dragNode, position) => {
      const findAndInsert = (data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === targetKey) {
            if (position === 0) {
              // 插入为子节点
              if (!data[i].children) {
                data[i].children = [];
              }
              data[i].children.push(dragNode);
            } else {
              // 插入到兄弟节点的位置
              const index = position === -1 ? i : i + 1;
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
      findAndInsert(datatree.value);
    };
</script>