<template>
    <div>
        <h1>底部导航栏</h1>
        <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab1">
                首页
            </mt-tab-container-item>
            <mt-tab-container-item id="tab2">
                购物车
            </mt-tab-container-item>
        </mt-tab-container>
        <mt-tabbar fixed v-model="active">
            <mt-tab-item id="tab1">
                <img slot="icon" src="../../assets/Home.png" alt="">
                首页
            </mt-tab-item>
            <mt-tab-item id="tab2">
                <img slot="icon" src="../../assets/ShoppingCart.png" alt="">
                购物车
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                active:""
            }
        },
        methods:{}
    }
</script>