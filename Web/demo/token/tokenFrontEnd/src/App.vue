<template>



  <div>
    <!-- <component :is="xxx" /> -->
     <router-view></router-view>
  </div>



</template>

<script setup>
import { defineEmits, defineProps, ref, computed, onMounted, inject, provide, getCurrentInstance } from "vue";
import axios from "axios";
// import xxx from "@/views/xxx.vue";
// const props = defineProps({});
// const emit = defineEmits([]);



</script>

<style scoped>



</style>