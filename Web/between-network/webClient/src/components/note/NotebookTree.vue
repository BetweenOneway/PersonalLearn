<template>
    <n-tree
      block-line
      :data="notebookTreeMenu"
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
    import noteServerRequest  from "@/request"
    import notebookApi from '@/request/api/notebookApi';
  
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
                        children:[]
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
                        parentNotebook.children.push(curNotebook);

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
    const optionsRef = ref([
        {
            label:'新建文件夹',
            key:'createNotebook'
        },
        {
            label:'新建笔记',
            key:'createNote'
        }
    ]);

    let defaultExpandedKeys= ref(['my-folder']);
    let showDropdown = showDropdownRef;

    let handleSelect = () => {
        //showDropdownRef.value = false;
    };
    let handleClickoutside = () => {
        showDropdownRef.value = false;
    }

    function addNewNoteBook(parent_id)
    {

    }

    const xRef = ref(0);
    const yRef = ref(0);
    let x = xRef;
    let y = yRef;
    let nodeProps = ({ option }) => {
        return {
            onClick() {
                //单击笔记本
            },
            onContextmenu(e) {
                xRef.value = e.clientX;
                yRef.value = e.clientY;

                console.log(`[Notebook Right Click] ${option.key} - ${option.label}`);
                showDropdownRef.value = true;
                e.preventDefault();
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
