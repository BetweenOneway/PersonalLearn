<template>
    <n-space vertical>
        <n-slider v-model:value="value" :step="10" @update:value="onChange" @dragend="dragEndCall"/>
        <n-input-number v-model:value="value" size="small" />
    </n-space>
</template>
  
<script setup>
    import { ref } from "vue";

    const value = ref(50);

    function onChange(val)
    {
        console.log("onUpdate val=>",val);
        console.log("value=>",value);
    }

    function dragEndCall()
    {
        console.log("dragEndCall value=>",value.value);
    }
</script>