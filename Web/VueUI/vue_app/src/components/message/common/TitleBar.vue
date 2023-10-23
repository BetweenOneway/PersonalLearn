<template>
    <div>
        <span>{{leftTitle}}</span>
        <div class="right-head">
            <div @click="search"><img :src="rightFirstImg" alt=""></div>
            <div @click="add3"><img :src="rightSecondImg" alt=""></div>
        </div>
    </div>
</template>
<script>
    export default{
        props:{
            leftTitle:{default:""},//左侧文字
            rightFirstImg:{default:""},//第一张图
            rightSecondImg:{default:""},//第二张图
            search:{type:Function},
            add3:{type:Function},
        }
    }
</script>