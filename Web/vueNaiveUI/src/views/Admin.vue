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
      <router-view v-else />
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
  
      // 判断是否为默认视图
    const isDefaultView = computed(() => {
      return route.path === '/admin' && (!activeKey.value || activeKey.value === 'Admin');
    });

      // 菜单选择事件处理
      const handleMenuSelect = (key) => {
        const selectedMenu = menuOptions.find((item) => item.key === key);
        if (selectedMenu && selectedMenu.path) {
          router.push(selectedMenu.path); // 路由跳转
          activeKey.value = key; // 更新激活的菜单项
          console.log("activeKey.value=>",activeKey.value);
        }
      };
  </script>
  