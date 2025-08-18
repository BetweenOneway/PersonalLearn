<template>
    <h3>This is component 2</h3>
</template>

<script setup>
    import { onMounted,onBeforeUnmount,onUnmounted } from 'vue'

    onMounted(()=>{
        console.log("Comp2.vue onMounted")
    })

    onBeforeUnmount(()=>{
        console.log("Comp2.vue onBeforeUnmount")
    })

    onUnmounted(()=>{
        console.log("Comp2.vue onUnmounted")
    })
</script>