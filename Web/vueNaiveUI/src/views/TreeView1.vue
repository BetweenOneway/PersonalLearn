<template>
    <n-tree
      block-line
      :data="data"
      :default-expanded-keys="defaultExpandedKeys"
      :node-props="nodeProps"
    />
    <n-dropdown
      trigger="manual"
      placement="bottom-start"
      :show="showDropdown"
      :options="optionsRef"
      :x="x"
      :y="y"
      @select="handleSelect"
      @clickoutside="handleClickoutside"
    />
</template>
  
<script setup>
    import { repeat } from "seemly";
    import { ref } from "vue";
  
    function createData(level = 4, baseKey = "") {
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

    const showDropdownRef = ref(false);
    const optionsRef = ref([]);
    const xRef = ref(0);
    const yRef = ref(0);
    let data = createData();
    console.log("data=>",data);

    let defaultExpandedKeys= ref(["40", "41"]);
    let showDropdown = showDropdownRef;
    let x = xRef;
    let y = yRef;

    let handleSelect = () => {
        showDropdownRef.value = false;
    };
    let handleClickoutside = () => {
        showDropdownRef.value = false;
    }
    let nodeProps = ({ option }) => {
        return {
            onClick() {
                //对于有子文件夹的文件夹，点击展开按钮并不会触发该事件
                //只有点击文件夹名称才会触发
                console.log(`[Click] ${option.key} - ${option.label}`);
            },
            onContextmenu(e) {
                console.log('option=>',option);
                optionsRef.value = [option];
                showDropdownRef.value = true;
                xRef.value = e.clientX;
                yRef.value = e.clientY;
                console.log(`[Right Click] ${option.key} - ${option.label}`);
                e.preventDefault();
            }
        };
    }

  </script>
