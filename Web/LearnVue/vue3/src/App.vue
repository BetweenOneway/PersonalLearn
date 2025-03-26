<template>
  <RouterView />
</template>

<script setup>
import { onMounted,onBeforeUnmount,onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { saveAs } from 'file-saver'

function handleBeforeUnload()
{
    localStorage.removeItem("username");
}

onMounted(()=>{
    console.log("App.vue onMounted")
    window.addEventListener('beforeunload', handleBeforeUnload)
    let curItem = localStorage.getItem("username");
    console.log(curItem);
    if(!!curItem)
    {
        console.log("有内容")
        localStorage.setItem("username", "David");
    }
    else
    {
        console.log("无内容")
        localStorage.setItem("username", "JohnDoe");
    }
})

onBeforeUnmount(()=>{
    //没啥用，怎么都触发不了
    //window.removeEventListener('unload', unloadFunction)
   //alert("App.vue onBeforeUnmount")
   //localStorage.removeItem("username");
})

onUnmounted(()=>{
    window.removeEventListener('beforeunload', handleBeforeUnload);
    //也没啥用，怎么都触发不了
    localStorage.removeItem("username");
    //window.removeEventListener('unload', unloadFunction)
})


</script>

<style scoped>
</style>
