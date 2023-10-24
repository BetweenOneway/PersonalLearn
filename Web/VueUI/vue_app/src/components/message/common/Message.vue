<template>
    <div class="rootStyle">
        <!--一条消息子组件-->
        <!--左侧图片与标题-->
        <div class="leftImgTxt">
            <img :src="require('../../../assets/Home.png')" class="imgStyle" alt="">
            <div class="rightOfImg">
                <span class="titleBar">今天股票涨</span>
                <span class="subTitle">其实没涨</span>
            </div>
        </div>
        <!--右侧时间-->
        <span class="sendTime">下午 3:38</span>
    </div>
</template>

<script>
    export default{
        components:{
        }
    }
</script>

<style scoped>
    .rootStyle{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .leftImgTxt{
        display:flex;
        align-items: center;
    }
    .imgStyle{
        width:50px;
        height:50px;
    }
    .rightOfImg{
        display:flex;
        flex-direction: column;
        justify-content: center;
    }
</style>