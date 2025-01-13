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
            label:'level',
            key:'01',
            isedit:false,
            children:[
                {
                    label:'level 0-1-1-1',
                    key:'0111',
                    isedit:false,
                },
                {
                    label:'level 0-1-1-2',
                    key:'0112',
                    isedit:false,
                }
            ]
        },
        {
            label:'level2',
            key:'02',
            isedit:false,
            children:[
                {
                    label:'level 0-2-1-1',
                    key:'0211',
                    isedit:false,
                },
                {
                    label:'level 0-2-1-2',
                    key:'0212',
                    isedit:false,
                }
            ]
        }
    ]);

    let props={
        isedit:true,
        isdelect:true,
        isadd:true,
    }
    //节点内容渲染函数
    const inputRef = ref(null)

    const nodelabel = ({ option }) => {
        //  console.log(option.key)
        return h(
            'div',
            { 
                class: 'node', 
                style: { height: '0.25rem', width: '10rem' } 
            },
            (option.isedit == true && props.isedit)
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
                        option.isedit = false
                    },
                    onBlur: () => {
                        option.isedit = false
                    }
                }
            )
            : option.label
        )
    }

    //节点后缀渲染
    const nodesuffix = ({ option }) => {
        if (!option.children && option.key == key.value && props.isdelect) 
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
        else if ((option.children) && props.isadd) 
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
                    console.log('ondblclick');
                    inputRef.focus()
                })
            }
        }
    }
</script>