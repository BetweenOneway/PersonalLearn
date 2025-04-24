<template>
    <n-layout has-sider>
      <!-- 左侧菜单 -->
      <n-layout-sider>
        <n-menu
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuSelect"
        />
      </n-layout-sider>
  
      <!-- 右侧内容区域 -->
      <n-layout-content>
        <div v-if="isDefaultView">
            <AdminDefault />
        </div>
        <n-tabs
        v-model:value="activeTab"
        type="card"
        closable
        @close="handleTabClose" v-else
      >
        <n-tab-pane
          v-for="tab in tabs"
          :key="tab.key"
          :name="tab.key"
          :tab="tab.label"
        >
          <router-view v-if="tab.key === activeTab" />
        </n-tab-pane>
      </n-tabs>
      </n-layout-content>
    </n-layout>
  </template>
  
<script setup>
    import { ref,computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { NLayout, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui';
    import { useRoute } from 'vue-router';
    import AdminDefault from '@/components/admin/AdminDefault.vue';

    const route = useRoute();

    const router = useRouter();

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

    const activeKey = ref(menuOptions[0].key);

    // 当前激活的 Tab 键值
    const activeTab = ref(null);

    // 所有打开的 Tab 页
    const tabs = ref([]);

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
                activeTab.value = null;
                activeKey.value = 'Admin'
            }
        }
    };
  
      // 判断是否为默认视图
    const isDefaultView = computed(() => {
        console.log(`is default view=>route.path=[${route.path}] | activeKey.value=[${activeKey.value}]`)
        return (route.path === '/admin' && (!activeKey.value || activeKey.value === 'Admin')) 
        || 0 == tabs.value.length;
    });

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
            activeKey.value = key; // 更新激活的菜单项
            console.log("activeKey.value=>",activeKey.value);
            if(activeKey.value==='Admin')
            {
                tabs.value = [];
            }
        }
    };
  </script>
  