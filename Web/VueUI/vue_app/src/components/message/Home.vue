<template>
    <div class="page-tabbar">
        <div class="page-wrap">
            <titlebar leftTitle="微信(666)" :rightFirstImg="require('../../assets/search.png')"
            :rightSecondImg="require('../../assets/add.png')" :search="mysearch" :add3="myadd3"></titlebar>
            <div style="margin-top:48px;"></div>
            <!--父面板-->
            <mt-tab-container v-model="active">
                <mt-tab-container-item id="message">
                    <!--保存多条消息-->
                    <!--<messageList></messageList> 两种写法都行-->
                    <message-list></message-list>
                    
                </mt-tab-container-item>
            </mt-tab-container>
            <!--tabbar列表-->
            <mt-tabbar fixed v-model="active">
                <mt-tab-item id="message" @click.native="changeState(0)">
                    <tabbar-icon :selectedImage="require('../../assets/ic_weixin_selected.png')"
                    :normalImage="require('../../assets/ic_weixin_normal.png')" :focused="currentIndex[0].isSelect"></tabbar-icon>
                    微信
                </mt-tab-item>
                <mt-tab-item id="contack" @click.native="changeState(1)">
                    <tabbar-icon :selectedImage="require('../../assets/ic_contacts_selected.png')"
                    :normalImage="require('../../assets/ic_contacts_normal.png')" :focused="currentIndex[1].isSelect"></tabbar-icon>
                    通讯录
                </mt-tab-item>
                <mt-tab-item id="find" @click.native="changeState(2)">
                    <tabbar-icon :selectedImage="require('../../assets/ic_find_selected.png')"
                    :normalImage="require('../../assets/ic_find_normal.png')" :focused="currentIndex[2].isSelect"></tabbar-icon>
                    发现
                </mt-tab-item>
                <mt-tab-item id="mine" @click.native="changeState(3)">
                    <tabbar-icon :selectedImage="require('../../assets/ic_me_selected.png')"
                    :normalImage="require('../../assets/ic_me_normal.png')" :focused="currentIndex[3].isSelect"></tabbar-icon>
                    我的
                </mt-tab-item>
            </mt-tabbar>
        </div>
    </div>
</template>

<script>
    import TitleBar from "./common/TitleBar.vue"
    import messageList from "./common/MessageList.vue"
    import TabbarIcon from "./common/TabbarIcon.vue"

    export default{
        data(){
            return {
                active:"message",
                //创建数组保存所有底部导航条图片状态
                currentIndex:[
                    {isSelect:true},
                    {isSelect:false},
                    {isSelect:false},
                    {isSelect:false},
                ]
            }
        },
        components:{
            "titlebar":TitleBar,
            "messageList":messageList,
            "tabbarIcon":TabbarIcon
        },
        methods:{
            mysearch(){
                console.log("search")
            },
            myadd3(){
                console.log("add")
            },
            changeState(index){
                console.log(index);
                for(var i=0;i<this.currentIndex.length;i++)
                {
                    if(i==index)
                    {
                        this.currentIndex[i].isSelect=true;
                    }
                    else{
                        this.currentIndex[i].isSelect = false;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .page-tabbar{
        overflow:hidden;
    }
    .page-wrap{
        overflow:auto;
        padding-bottom: 60px;/*底部导航条*/
    }
    .mint-tabbar > .mint-tab-item {
        color:#999;
    }
    .mint-tabbar > .mint-tab-item.is-selected
    {
        background-color: transparent;
        color:#45c018;
    }
</style>