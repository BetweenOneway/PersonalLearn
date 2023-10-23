<template>
    <div>
        <img :src="img3" alt="">
        <br><hr>
        <h3 @click="add3">add3</h3>
        <br><hr>
        <h2>{{msg}}</h2>
    </div>
</template>
<script>
    export default{
        props:{
            msg:{default:"123"},
            add3:{type:Function},//type 接收类型 Function 函数类型
            img3:{default:""}//图片路径
        }
    }
</script>
