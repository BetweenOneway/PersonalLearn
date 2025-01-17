<template>
    <div>
        <fieldset>
            <legend>ChildComponentA</legend>
            <div>
                <fieldset>
                    <legend>接收</legend>
                    <input type="text" placeholder="收到的消息" disabled :value="msg">
                </fieldset>
                <fieldset>
                    <legend>操作</legend>
                    <button @click="sendMsgToParent">通过事件给父组件发送消息</button>
                    <button>给兄弟组件发送消息</button>
                </fieldset>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
    import bus from 'vue3-eventbus'

    //当组件卸载完毕之前 移除监听
    onBeforeUnmount(()=>{
        //
        bus.off('sendMsgToBrother',getMsgFromBrother)
    })

    bus.on('sendMsgToBrother',getMsgFromBrother)

    defineProps(
        {
            msg:{type:String,required:false},
        }
    )

    const emit = defineEmits(['sendMsgToParent'])

    function sendMsgToParent()
    {
        console.log("子组件给父组件发送消息")
        emit("sendMsgToParent","来自ChildComponentA的问候");
    }

    function getMsgFromBrother(val)
    {
        
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