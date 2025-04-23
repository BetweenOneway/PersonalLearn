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
            <h1>欢迎来到我们的网站</h1>
            <p>请选择左侧菜单中的选项以开始浏览。</p>
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

    const route = useRoute();

    const router = useRouter();
    const activeKey = ref(null);

    // 定义菜单选项
    const menuOptions = [
        {
          label: 'Admin',
          key: 'Admin',
          path: '/admin',
        },
        {
          label: 'About',
          key: 'About',
          path: '/admin/about',
        },
        {
          label: 'Contact',
          key: 'Contact',
          path: '/admin/contact',
        },
    ];

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

      // 菜单选择事件处理
      const handleMenuSelect = (key) => {
        console.log("menu select key=>",key);
        const selectedMenu = menuOptions.find((item) => item.key === key);
        if (selectedMenu && selectedMenu.path) {
            addTab(selectedMenu.key, selectedMenu.label, selectedMenu.path);
            router.push(selectedMenu.path); // 路由跳转
            activeKey.value = key; // 更新激活的菜单项
            console.log("activeKey.value=>",activeKey.value);
        }
      };
  </script>
  