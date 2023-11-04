<template>
    <div>
        <h1>A.vue 演示Vuex 共享age</h1>
        <h1>{{$store.getters.getAge}}</h1>
        <h1>{{$store.getters.getCar}}</h1>
    </div>
</template>

<script>
    export default{
        created(){
            console.log(this);
        },
        data(){
            return {}
        },
        methods:{},
        props:{},
        components:{
        }
    }
</script>

<style scoped>
</style>