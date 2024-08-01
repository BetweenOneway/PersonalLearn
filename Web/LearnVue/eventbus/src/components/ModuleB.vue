<!-- B.vue -->

<template>

    <!-- 展示msgB -->
    <p>{{msgB}}</p>
    
</template>
  
<script>
    import { EventBus } from "../utils/event-bus";
    export default {
        data(){
            return {
            //初始化一个msgB
            msgB: 'ModuleB msg'
            }
        },
        mounted() {
            /*调用全局Vue实例中的$EventBus事件总线中的$on属性,监听A组件发送
            到事件总线中的aMsg事件*/
            EventBus.$on("aMsg", (data) => {
            //将A组件传递过来的参数data赋值给msgB
            this.msgB = data;
            });
        },
        beforeDestroy(){
            //移除监听事件"aMsg"
            this.$EventBus.$off("aMsg")
        }
    };
</script>