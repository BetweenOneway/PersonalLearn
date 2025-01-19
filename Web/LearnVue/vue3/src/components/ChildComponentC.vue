<template>
    <div>
        <fieldset>
            <legend>ChildComponentC</legend>
            <div>
                <fieldset>
                    <legend>接收</legend>
                    <div>{{ info }}</div>
                </fieldset>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
    import { ref,onBeforeUnmount } from 'vue';
    import bus from 'vue3-eventbus'
    let info=ref('');

    //当组件卸载完毕之前 移除监听
    onBeforeUnmount(()=>{
        //
        bus.off('sendMsgToBrother',getMsgFromOtherComponent)
    })

    bus.on('sendMsgToBrother',getMsgFromOtherComponent)

    function getMsgFromOtherComponent(val)
    {
        info.value = val;
    }

    function updateInfo()
    {
        info.value = "update"
    }

    //组件默认不会自动暴露内部的任何状态或方法给外部使用，为了显式暴露某些属性或方法，可以使用 defineExpose
    defineExpose({
        info,
        updateInfo
    })
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