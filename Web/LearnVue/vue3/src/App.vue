<template>
  <RouterView />
</template>

<script setup>
import { onMounted,onBeforeUnmount,onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { saveAs } from 'file-saver'

function loadFunction()
{
    console.log("app.vue unload");
    //该函数无效怎么都不会触发
    let blob = new Blob(["App.vue unload"], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "./unload.txt");
}

function unloadFunction()
{
    console.log("App.vue onUnmounted")
    let blob = new Blob(["App.vue onBeforeUnmount"], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "./onUnmounted.txt");
    sleep(5000);
}

onMounted(()=>{
    console.log("App.vue onMounted")
    // window.addEventListener('beforeunload', () => {
    //     //界面关闭或者刷新都会触发该函数
    //     let blob = new Blob(["App.vue beforeunload"], {type: "text/plain;charset=utf-8"});
    //     saveAs(blob, "./beforeunload.txt");
    // })
    window.addEventListener('unload', unloadFunction)
})

onBeforeUnmount(()=>{
    //window.removeEventListener('unload', unloadFunction)
    console.log("App.vue onBeforeUnmount")
})

onUnmounted(()=>{
    window.removeEventListener('unload', unloadFunction)
})


</script>

<style scoped>
</style>
