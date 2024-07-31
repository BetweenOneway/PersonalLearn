<!-- A.vue -->
<template>
    <button @click="sendMsg()">Click Me SendMsg</button>
</template>

<script> 
import { EventBus } from "../utils/event-bus";
export default {
  methods: {
    sendMsg() {
      EventBus.$emit("aMsg", '来自A页面的消息');
    }
  }
}; 
</script>