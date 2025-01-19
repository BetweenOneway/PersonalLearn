<template>
    <div>
        <fieldset>
            <legend>父组件</legend>
            <fieldset>
                <legend>接收</legend>
                <textarea disabled style="width: 300px;">{{receivedMsg}}</textarea>
            </fieldset>
            
            <fieldset>
                <legend>操作</legend>
                <button @click="sendMsgToA">通过props给子组件A发送消息</button>
            </fieldset>
            
        </fieldset>
    </div>

    <div class="child_container">
        <div class="container-item">
            <ChildComponentA :msg="msg" @sendMsgToParent="getMsgFromChild"/>
        </div>
        <div class="container-item">
            <ChildComponentB />
        </div>    
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { getCurrentTime } from '@/utils/common';

    import ChildComponentA from '@/components/ChildComponentA.vue';
    import ChildComponentB from '@/components/ChildComponentB.vue';
    
    let msg=ref('msg from parent');

    function sendMsgToA()
    {
        msg.value= getCurrentTime();
    }

    let receivedMsg = ref('接收到的值');

    function getMsgFromChild(e)
    {
        console.log("父组件收到来自子组件的消息")
        receivedMsg.value = e;
    }
</script>

<style scoped>
    .child_container{
        display: flex;
    }
    .container-item{
        flex:1;
    }
</style>