<template>
    <div>
        <fieldset>
            <legend>ChildComponentB</legend>
            <div>
                <button>给父组件发送消息</button>
                <button @click="sendMsgToBrother">给兄弟组件发送消息</button>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
    import bus from 'vue3-eventbus'

    import { getCurrentTime } from '@/utils/common';

    function sendMsgToBrother()
    {
        bus.emit('sendMsgToBrother',getCurrentTime());
    }
</script>

<style scoped>
fieldset {
    border: 1px solid#ddd;
    padding: 12px;
}
 
legend {
    font-size: 18px;
    padding: 0 10px;
}
</style>