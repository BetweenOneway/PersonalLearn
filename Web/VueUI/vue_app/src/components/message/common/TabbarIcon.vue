<template>
    <div>
        <img :src="focused?selectedImage:normalImage" alt="" class="imgStyle">
    </div>
</template>

<script>
    export default{
        data(){
            return {}
        },
        methods:{},
        props:{
            focused:false,
            selectedImage:{default:""},
            normalImage:{default:""}
        },
        components:{
        }
    }
</script>

<style scoped>
    .imgStyle{
        width:30px;
        height:30px;
    }
</style>