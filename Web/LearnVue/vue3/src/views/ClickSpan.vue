<template>
    <div class="text-display-container">
      <!-- 模拟按钮的 span 元素 -->
      <span 
        class="display-btn" 
        @click="toggleShowText"
      >
        点击显示文字
      </span>
      
      <!-- 条件渲染要显示的文字 -->
      <div v-if="showText" class="displayed-text">
        这是点击按钮后显示的文字内容！
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // 定义响应式变量，控制文字显示状态，初始为隐藏
  const showText = ref(false)
  
  // 点击事件处理函数：切换显示状态
  const toggleShowText = () => {
    showText.value = !showText.value
  }
  </script>
  
  <style scoped>
  /* 容器样式，让内容居中显示 */
  .text-display-container {
    padding: 50px;
    font-family: Arial, sans-serif;
  }
  
  /* span 按钮样式 */
  .display-btn {
    display: inline-block;
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    user-select: none; /* 禁止文字选中 */
    transition: background-color 0.2s;
  }
  
  /* 鼠标悬停效果 */
  .display-btn:hover {
    background-color: #359469;
  }
  
  /* 显示的文字样式 */
  .displayed-text {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #333;
    font-size: 16px;
  }
  </style>