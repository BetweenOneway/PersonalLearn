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
                <button @click="sendMsgByProvide">通过Provide给子组件发送消息</button>
                
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
    import { ref,onBeforeUnmount,provide } from 'vue';
    import { getCurrentTime } from '@/utils/common';
    import bus from 'vue3-eventbus'

    import ChildComponentA from '@/components/ChildComponentA.vue';
    import ChildComponentB from '@/components/ChildComponentB.vue';
    
    let msg=ref('msg from parent');

    function sendMsgToA()
    {
        msg.value= 'msg from parent=>'+getCurrentTime();
    }

    let receivedMsg = ref('接收到的值');

    function getMsgFromChild(e)
    {
        console.log("父组件收到来自子组件的消息")
        receivedMsg.value = e;
    }

    //当组件卸载完毕之前 移除监听
    onBeforeUnmount(()=>{
        //
        bus.off('sendMsgToBrother',getMsgFromBrother)
    })
    bus.on('sendMsgToBrother',getMsgByBus)

    function getMsgByBus(val)
    {
        receivedMsg.value = val;
    }

    //
    const provideMsg = ref('');
    function sendMsgByProvide()
    {
        provideMsg.value = 'msg from parent=>'+getCurrentTime();
    }
    provide(/* 注入名 */ 'message', /* 值 */ provideMsg)
</script>

<style scoped>
    .child_container{
        display: flex;
    }
    .container-item{
        flex:1;
    }
</style>