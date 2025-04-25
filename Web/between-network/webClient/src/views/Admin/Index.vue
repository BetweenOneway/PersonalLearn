<template>
    <n-layout has-sider>
        <!-- 左侧菜单 -->
        <n-layout-sider :inverted="inverted" bordered>
            <n-menu
            :options="menuOptions"
            :value="activeTab"
            @update:value="handleMenuSelect"
            />
        </n-layout-sider>
  
        <!-- 右侧内容区域 -->
        <n-layout-content>
            <n-tabs
            v-model:value="activeTab"
            type="card"
            closable
            @close="handleTabClose"
            @update:value="handleTabChange"
            >
                <n-tab-pane
                v-for="(tab,index) in tabs"
                :key="tab.key"
                :name="tab.key"
                :tab="tab.label"
                :closable="index !== 0"
                >
                    <router-view v-if="tab.key === activeTab" />
                </n-tab-pane>
        </n-tabs>
        </n-layout-content>
    </n-layout>
  </template>
  
<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { NLayout, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui';

    const router = useRouter();

    const inverted=ref(false);

    // 定义菜单选项
    const menuOptions = [
        {
          label: '首页',
          key: 'Admin',
          path:'/admin'
        },
        {
            label: '个人信息',
            key: 'PersonalInfo',
            children:[
                {
                    label: '管理个人信息',
                    key: 'manage-personal-info',
                    path: '/admin/updatepersonalinfo',
                },
                {
                    label: '忘记密码',
                    key: 'forget-password',
                    path: '/admin/forgetpassword',
                },
            ],
        },
        {
            label: '笔记管理',
            key: 'manage-note',
            children:[
                {
                    label: '回收站',
                    key: 'recycleb',
                    path: '/admin/recycle',
                },
            ]
        },
    ];

    // 当前激活的 Tab 键值
    const activeTab = ref('Admin');

    // 所有打开的 Tab 页
    const tabs = ref([
        {label: '首页',key: 'Admin',path:'/admin'}
    ]);

    // 添加 Tab 页
    const addTab = (key, label, path) => {
        if (!tabs.value.some((tab) => tab.key === key)) {
            tabs.value.push({ key, label, path });
        }
        activeTab.value = key; // 激活对应 Tab
    };

    // 关闭 Tab 页
    const handleTabClose = (key) => {
        console.log("close tab key=>",key);
        const index = tabs.value.findIndex((tab) => tab.key === key);
        tabs.value.splice(index, 1); // 移除关闭的 Tab

        if (activeTab.value === key) {
            // 如果关闭的是当前激活的 Tab，则跳转到最后一个 Tab 或回到首页
            const lastTab = tabs.value[tabs.value.length - 1];
            if (lastTab) {
                router.push(lastTab.path);
                activeTab.value = lastTab.key;
            } else {
                router.push('/admin');
                activeTab.value = 'Admin';
            }
        }
    };

    // 标签页切换处理 
    const handleTabChange = (key) => {
        console.log(' 切换到标签页:', key);
        const index = tabs.value.findIndex((tab) => tab.key === key);
        const selectTab = tabs.value[index];
        router.push(selectTab.path);
        activeTab.value = key;
    };

    function FindMenuItemByKey(startNode,key)
    {
        for( var menuItem of startNode)
        {
            if(menuItem.key === key)
            {
                return menuItem;
            }
            else if(0 != (menuItem?.children?.length ?? 0))
            {
                let findResult = FindMenuItemByKey(menuItem.children,key);
                if(!!findResult)
                {
                    return findResult;
                }
            }
        }
        
        return undefined;
    }

    // 菜单选择事件处理
    const handleMenuSelect = (key) => {
        console.log("menu select key=>",key);
        const selectedMenu = FindMenuItemByKey(menuOptions,key)
        console.log("Find selected menu=>",selectedMenu);
        if (selectedMenu && selectedMenu.path) {
            addTab(selectedMenu.key, selectedMenu.label, selectedMenu.path);
            router.push(selectedMenu.path); // 路由跳转
            activeTab.value = key; // 更新激活的菜单项
            console.log("activeTab.value=>",activeTab.value);
            if(activeTab.value==='Admin')
            {
                tabs.value = [{label: '首页',key: 'Admin',path:'/admin'}];
            }
        }
    };

    function Init()
    {
        activeTab.value = 'Admin';
        tabs.value = [{label: '首页',key: 'Admin',path:'/admin'}];
    }

    Init();
</script>

<style scoped></style>
  