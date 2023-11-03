<template>
    <div class="product-app">
        <div class="goods-item" v-for="(item,index) of list" :key="index">
            <img :src="'http://127.0.0.1:8080/'+item.img_url" alt="">
            <h5>{{item.lname}}</h5>
            <div class="info">{{item.price}}</div>
            <mt-button @click="addcart" :data-lid="item.lid" :data-price="item.price" :data-lname="item.lname">加入购物车</mt-button>
        </div>
        <mt-button size="large" @click="loadMore">加载更多</mt-button>
        <mt-button size="large" @click="ShowCart">查看购物车</mt-button>
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
            },
            addcart(event){
                var lid = event.target.dataset.lid;
                var lname = event.target.dataset.lname;
                var price = event.target.dataset.price;
                console.log(lid+"|"+lname+"|"+price);
                var url="addcart";
                var obj={lid:lid,lname:lname,price:price};
                this.axios.get(url,{params:obj}).then(res=>{
                    console.log(res);
                    if(res.data.code == -1)
                    {
                        this.$messagebox("消息","请登录").then(res=>{
                            this.$router.push("/Login");
                        });
                    }
                    else if(res.data.code == -2)
                    {
                        this.$messagebox("消息","添加失败");
                    }
                    else
                    {
                        this.$messagebox("消息","添加成功");
                    }
                });
            },
            ShowCart(){
                this.$router.push("/Cart");
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