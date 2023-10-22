<template>
    <div>
        <h1>Fa08.vue 父组件</h1>
        <sub08></sub08>
    </div>
</template>
<script>
import Sub08 from "./Sub08.vue"

export default{
    data(){
        return {}
    },
    //注册子组件
    components:{
        "sub08":Sub08
    }
}
</script>