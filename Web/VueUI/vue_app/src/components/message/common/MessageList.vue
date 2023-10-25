<template>
    <div>
        <message class="itemStyle" v-for="(item,index) in rows.data" :key="index" :sendTime="item.time" 
        :title="item.title" :subTitle="item.subtitle" :imageurl="require('../../../assets/Home.png')"></message>
    </div>
</template>

<script>
    import Message from "./Message.vue"
    //引入项目模拟数据文件
    //自动将json文件数据转换成js对象
    import json from "../json/messagelist.json"

    export default{
        data(){
            return {rows:json}
        },
        components:{
            "message":Message,
        }
    }
</script>

<style scoped>
    .itemStyle{
        padding:5px;
        border-bottom: 1px solid #d9d9d9;
    }
</style>