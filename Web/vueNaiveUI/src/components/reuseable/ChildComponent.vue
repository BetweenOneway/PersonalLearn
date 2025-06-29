<template>
    <div class="child-component" v-show="show">
      <h3>{{ title }}</h3>
      <n-button @click="sendMessage">发送消息给父组件</n-button>
    </div>
  </template>
  
<script setup>
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import {useStateStore} from '@/stores/state'
    const stateStore = useStateStore()
    const {show} = storeToRefs(stateStore)
    const {toggleShow} = stateStore;

  const emit = defineEmits(['childEvent'])

    const title = ref("子组件")

    const sendMessage = () => {
        emit('childEvent', `来自子组件的消息:  ${Math.random().toFixed(2)}`)
    }
  </script>
  
  <style scoped>
  .child-component {
    padding: 1rem;
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
  }
  </style>    