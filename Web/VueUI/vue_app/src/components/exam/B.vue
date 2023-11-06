<template>
    <div>
        <h1>B.vue 演示Vuex 共享age</h1>
        <h1>{{$store.getters.getAge}}</h1>
        <h1>{{$store.getters.getCar}}</h1>
        <button @click="upCar">升级汽车</button>
        <button @click="upAge">修改年龄</button>
        <button @click="clearAge">清空年龄</button>
    </div>
</template>

<script>
    export default{
        data(){
            return {}
        },
        methods:{
            upCar(){
                this.$store.commit("updateCar")
            },
            upAge(){
                this.$store.commit("updateAge",63);
            },
            clearAge(){
                this.$store.dispatch("modifyAge");
            }
        },
        props:{},
        components:{
        }
    }
</script>

<style scoped>
</style>