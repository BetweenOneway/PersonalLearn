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
                        //addnode(e, option.key)
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
</script>