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

    import { repeat } from "seemly";
    import { ref,h,nextTick } from "vue";
  
    function createData(level = 2, baseKey = "") {
        if (!level)
            return void 0;
        //重复创建一个数组，数组长度为6-4,值为undefined
        let data = repeat(6 - level, void 0);
        console.log("data=>",data);
        return data.map(
            (_, index) => {
                const key = `${baseKey}${level}${index}`;
                return {
                    label: createLabel(level),
                    key,
                    children: createData(level - 1, key)
                };
            }
        );
    }
  
    function createLabel(level) {
        if (level === 4)
            return "道生一";
        if (level === 3)
            return "一生二";
        if (level === 2)
            return "二生三";
        if (level === 1)
            return "三生万物";
        return "";
    }

    let datatree = createData();

    let props={
        isedit:false,
        isdelect:false,
        isadd:false,
    }
    //节点内容渲染函数
    const inputRef = ref(null)
    const nodelabel = ({ option }) => {
    //  console.log(option.key)
    return h(
        'div',
        { class: 'node', style: { height: '0.25rem', width: '1.8rem' } },
        option.isedit == true && props.isedit
        ? h(NInput, {
            autofocus: true,
            ref: inputRef.value,
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
            })
        : option.label
    )
    }

    //节点后缀渲染
    const nodesuffix = ({ option }) => {
    if (
        !option.children &&
        option.key == key.value &&
        props.isdelect
    ) {
        return h(
        NButton,
        {
            text: true,
            type: 'info',
            color: '#00EAFF',
            size: 'tiny',
            onClick: e => {
            deltree(option.key), e.stopPropagation()//自定义节点删除函数
            }
        },
        { default: () => '删除' }
        )
    } else if ((option.children) && props.isadd) {
        return h(
        NButton,
        {
            type: 'info',
            color: '#007293',
            bordered: true,
            round: true,
            size: 'tiny',
            textcolor: '#CFFBFF',
            onClick: e => addnode(e, option.key)//自定义新增节点函数
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
                    inputRef.value?.focus()
                })
            }
        }
    }
</script>