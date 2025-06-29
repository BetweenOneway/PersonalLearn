<template>
    <div >
      <h2>父组件 1</h2>
      <n-button @click="toggleShowChildComponent">toggleShowChildComponent</n-button>
      <ChildComponent @childEvent="handleChildEvent"/>
      <!-- <ChildComponent 
        title="子组件实例 1"
        :messageFromParent="parentMessage"
        @childEvent="handleChildEvent"
      /> -->
      <p>收到的消息: {{ receivedMessage }}</p>
      <button @click="updateParentMessage">更新发送给子组件的消息</button>
    </div>
  </template>
  
<script setup>
    import { ref } from 'vue'
    import ChildComponent from './ChildComponent.vue'
    import {useStateStore} from '@/stores/state'
    const stateStore = useStateStore()
    const {toggleShow} = stateStore;

    const receivedMessage = ref('')
    const parentMessage = ref('来自父组件 1 的初始消息')

    const toggleShowChildComponent = ()=>{
        toggleShow();
    }

  const handleChildEvent = (message) => {
    receivedMessage.value = message
  }
  
  const updateParentMessage = () => {
        parentMessage.value = `父组件 1 的更新消息 ${Math.random().toFixed(2)}`
  }
  </script>    