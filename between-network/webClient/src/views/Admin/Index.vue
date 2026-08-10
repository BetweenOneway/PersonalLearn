<template>
    <n-layout has-sider class="admin-layout">
        <!-- 左侧菜单 -->
        <n-layout-sider :inverted="inverted" bordered>
            <n-menu
            :options="menuOptions"
            :value="activeTab"
            @update:value="handleMenuSelect"
            />
        </n-layout-sider>
  
        <!-- 右侧内容区域 -->
        <n-layout-content class="admin-content" :class="{ 'layout-default-background': theme.name != 'dark' }">
            <n-tabs
            class="admin-tabs"
            v-model:value="activeTab"
            type="card"
            closable
            tab-style="background-color:#FFF;"
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
    import { onMounted, ref, watch, provide } from 'vue';
    import {storeToRefs} from 'pinia'
    import { useRouter } from 'vue-router';
    import { NLayout, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui';
    import {useThemeStore} from '@/stores/themeStore'

    const themeStore = useThemeStore()
    const {theme} = storeToRefs(themeStore)

    const router = useRouter();

    const inverted=ref(false);

    watch(theme,(newVal,oldVal)=>{
        console.log("theme.newVal=>",newVal);
        console.log("theme.oldVal=>",oldVal);
    })

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
                    label: '基本设置',
                    key: 'basic-setting',
                    path: '/admin/basicsetting',
                },
                {
                    label: '安全设置',
                    key: 'safety-setting',
                    path: '/admin/safetysetting',
                }
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
        router.push(path); // 路由跳转
    };

    // 通过 provide 暴露 addTab，供子组件使用
    provide('addTab', addTab);

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
        }
    };

    // 根据当前路由找到对应的菜单项
    function FindMenuItemByPath(startNode, path)
    {
        for (var menuItem of startNode)
        {
            if (menuItem.path === path)
            {
                return menuItem;
            }
            else if (0 != (menuItem?.children?.length ?? 0))
            {
                let findResult = FindMenuItemByPath(menuItem.children, path);
                if (!!findResult)
                {
                    return findResult;
                }
            }
        }
        return undefined;
    }

    function Init()
    {
        const currentPath = router.currentRoute.value.path;
        // 若当前在 /admin 命中重定向，路径会被改写为 /admin/console
        const targetPath = currentPath === '/admin' ? '/admin/console' : currentPath;
        const matchedMenu = FindMenuItemByPath(menuOptions, targetPath);

        if (matchedMenu)
        {
            // 根据当前路由恢复对应的 Tab，避免刷新后首页被其他页面覆盖
            if (!tabs.value.some((tab) => tab.key === matchedMenu.key))
            {
                tabs.value.push({ key: matchedMenu.key, label: matchedMenu.label, path: matchedMenu.path });
            }
            activeTab.value = matchedMenu.key;
        }
        else
        {
            // 未匹配到菜单（如直达首页/console）时，确保首页 Tab 存在并激活
            if (!tabs.value.some((tab) => tab.key === 'Admin'))
            {
                tabs.value.push({label: '首页',key: 'Admin',path:'/admin'});
            }
            activeTab.value = 'Admin';
        }
    }

    Init();
</script>

<style scoped>
    .admin-layout {
        height: 100vh;
    }
    .layout-default-background {
        background: #f5f7f9;
    }
    .admin-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }
    .admin-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .admin-tabs :deep(.n-tabs-nav) {
        flex-shrink: 0;
    }
    .admin-tabs :deep(.n-tabs-pane-wrapper) {
        flex: 1;
        overflow: auto;
    }
    .admin-tabs :deep(.n-tab-pane) {
        height: 100%;
    }
</style>
  