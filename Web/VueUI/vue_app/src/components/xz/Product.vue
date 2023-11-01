<template>
    <div class="product-app">
        <div class="goods-item" v-for="(item,index) of list" :key="index">
            <img :src="'http://127.0.0.1:8080/'+item.img_url" alt="">
            <h5>{{item.lname}}</h5>
            <div class="info">{{item.price}}</div>
            <mt-button>加入购物车</mt-button>
        </div>
        <mt-button size="large" @click="loadMore">加载更多</mt-button>
        <mt-button size="large">查看购物车</mt-button>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                list:[],//保存服务器返回商品列表
                pno:0
            }
        },
        created(){
            this.loadMore();
        },
        methods:{
            loadMore(){
                this.pno++;
                var obj = {pno:this.pno}
                var url="product";
                this.axios.get(url,{params:obj}).then(res=>{
                    var rows = this.list.concat(res.data.data);
                    this.list = rows;
                })
            }
        },
        props:{},
        components:{
        }
    }
</script>

<style scoped>
    .product-app{
        display: flex;
        flex-wrap:wrap;
        justify-content: space-between;
        padding:4px;
    }
    .goods-item{
        width:49%;
        border:1px solid #CCC;
        border-radius: 5px;
        margin:2px 0;
        padding:2px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        min-height: 249px;
    }
    .goods-item img{
        width:100%;
    }
    .goods-item .info{
        color:red;
        font-size: 19px;
    }
</style>