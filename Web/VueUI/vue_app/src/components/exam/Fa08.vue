<template>
    <div>
        <h1>Fa08.vue 父组件</h1>
        <sub08 msg="来自父亲的问候" :add3="myadd3" :img3="require('../../assets/logo.png')"></sub08>
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
        //别名:引入的组件
        "sub08":Sub08
    },
    methods:{
        myadd3(){
            console.log("父组件创建的函数")
        }
    }
}
</script>