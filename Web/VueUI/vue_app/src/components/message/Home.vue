<template>
    <div class="page-tabbar">
        <div class="page-wrap">
            <titlebar leftTitle="微信(666)" :rightFirstImg="require('../../assets/search.png')"
            :rightSecondImg="require('../../assets/add.png')" :search="mysearch" :add3="myadd3"></titlebar>
        </div>
    </div>
</template>

<script>
    import TitleBar from "./common/TitleBar.vue"

    export default{
        components:{
            "titlebar":TitleBar
        },
        methods:{
            mysearch(){
                console.log("search")
            },
            myadd3(){
                console.log("add")
            }
        }
    }
</script>