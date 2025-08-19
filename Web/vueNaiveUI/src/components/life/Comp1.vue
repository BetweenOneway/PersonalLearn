<template>
    <h3>This is component 1</h3>
    <n-button @click="minus">-</n-button>
    <n-text>{{ value }}</n-text>
    <n-button @click ="add">+</n-button>

    <div>
        <n-button @click="ShowHide">{{show?'Hide':'Show'}}</n-button>
        <n-text v-if="show">Hello Component</n-text>
    </div>
    
</template>

<script setup>
    import { onBeforeMount,onMounted,
        onBeforeUnmount,onUnmounted,
        onUpdated,onActivated } from 'vue'
    import { ref } from 'vue';
    
    let value = ref(0);
    
    function add()
    {
        value.value ++;
    }

    function minus()
    {
        value.value --;
    }

    let show = ref(false);
    function ShowHide(){
        show.value = !show.value;
    }
    /*
    界面会直接加载，不会等onMounted函数执行完才加载显示
    onBeforeMount->onMounted
    */
    onBeforeMount(()=>{
        setTimeout(() => {
            console.log("Comp1.vue onBeforeMount")
        }, 5000);
    });

    onMounted(()=>{
        setTimeout(() => {
            console.log("Comp1.vue onMounted")
        }, 5000);
    })

    /*
    卸载组件的时候顺序
    onBeforeUnmount->onUnmounted
    */
    onBeforeUnmount(()=>{
        console.log("Comp1.vue onBeforeUnmount")
    })

    onUnmounted(()=>{
        console.log("Comp1.vue onUnmounted")
    })

    onUpdated(()=>{
        console.log("Comp1.vue onUpdated");
    });

    onActivated(()=>{
        console.log("Comp1.vue onActivated");
    });

    function Init(){
        setTimeout(()=>{
            console.log("Comp1 Init...")
        },5000);
    }

    Init();

</script>