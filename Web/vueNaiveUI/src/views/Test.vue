<template>
    <n-space vertical>
      <n-button @click="addTab">添加标签页</n-button>
      <n-tabs 
        v-model:active-key="activeKey"
        type="card"
        :tab-bar-style="{ marginBottom: '16px' }"
        @update:value="handleTabChange"
        @close="handleClose" 
      >
        <n-tab-pane 
          v-for="(tab, index) in tabs"
          :key="tab.id" 
          :name="tab.id" 
          :tab="tab.title" 
          :closable="index !== 0"
        >
          <div class="tab-content">
            <div>标签页内容 {{ tab.title  }}</div>
            <pre>当前激活ID: {{ activeKey }}</pre>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </template>
   
  <script setup>
  import { ref } from 'vue';
  import { NButton, NSpace, NTabs, NTabPane } from 'naive-ui';
   
  const activeKey = ref('0');
  const tabId = ref(1);
  const tabs = ref([
    { id: '0', title: '不可关闭标签页', content: '这是不可关闭的初始标签页' }
  ]);
   
  // 标签页关闭处理 
  const handleClose = (id) => {
    const index = tabs.value.findIndex(tab  => tab.id  === id);
    console.log(`index=>${index},id=>${id}`);
    // 更新激活标签页 
    if (activeKey.value  === id) {
      activeKey.value  = tabs.value[index  + 1]?.id || tabs.value[0].id; 
    }
    
    tabs.value.splice(index,  1);
  };
   
  // 标签页切换处理 
  const handleTabChange = (key) => {
    console.log(' 切换到标签页:', key);
  };
   
  // 添加新标签页 
  const addTab = () => {
    tabs.value.push({ 
      id: `${tabId.value++}`, 
      title: `标签页 ${tabId.value}`, 
      content: `这是新添加的标签页内容`
    });
    activeKey.value  = tabs.value[tabs.value.length  - 1].id;
  };
  </script>
   
  <style scoped>
  .tab-content {
    padding: 16px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
  </style>