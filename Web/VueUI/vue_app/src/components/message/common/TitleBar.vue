<template>
    <div class="page-head">
        <span>{{leftTitle}}</span>
        <div class="right-head">
            <div @click="search" class="searchdiv">
                <img :src="rightFirstImg" style="width:25px" alt="">
            </div>
            <div @click="add3" class="searchdiv" style="margin-left:20px;">
                <img :src="rightSecondImg" style="width:25px;margin-right:15px;" alt="">
            </div>
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
<style scoped>
    .page-head{
        display:flex;
        position:fixed;/*固定定位*/
        z-index: 999;/*浮动所有元素上方*/
        width:100%;
        justify-content: space-between;/*两端对齐*/
        align-items: center;/*垂直居中*/
        background-color: #393e3a;
        padding-left: 7px;
        padding-right: 7px;
        height: 48px;
        color:#fff;
        font-size:18px;
    }
    .right-head{
        display: flex;
    }
    .searchdiv{
        display: flex;
        align-items: center;
        height:48px;
    }
</style>