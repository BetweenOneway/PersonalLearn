<template>
    <div class="rootStyle">
        <!--一条消息子组件-->
        <!--左侧图片与标题-->
        <div class="leftImgTxt">
            <img :src=imageurl class="imgStyle" alt="">
            <div class="rightOfImg">
                <span class="titleBar">{{title}}</span>
                <span class="subTitle">{{subTitle}}</span>
            </div>
        </div>
        <!--右侧时间-->
        <span class="sendTime">{{sendTime}}</span>
    </div>
</template>

<script>
    export default{
        props:{
            imageurl:{default:""},
            title:{default:""},
            subTitle:{default:""},
            sendTime:{default:""},
        },
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

    .titleBar {
        color:#000;
        font-size:17px;
        text-align:left;
    }

    .subTitle{
        color:gray;
        font-size:4px;
    }
</style>