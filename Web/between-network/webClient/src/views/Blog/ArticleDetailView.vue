<template>
    <h1>hello world</h1>
</template>

<script setup>
    const propsData = defineProps({
        id:{type:String,required:true},
    })
    console.log("propsData.id=>",propsData.id);
</script>