<template>
    <div id="app">
      <h1>多父组件与子组件通信示例</h1>
      <ParentComponent1 />
      <ParentComponent2 />
    </div>
  </template>
  
  <script setup>
  import ParentComponent1 from '@/components/reuseable/ParentComponent1.vue'
  import ParentComponent2 from '@/components/reuseable/ParentComponent2.vue'
  </script>
  
  <style>
  </style>    