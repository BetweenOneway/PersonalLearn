<template>
    <div class="cart">
        <!--顶部按钮-->
        <div class="selectall" @change="selectAll">
            全选<input type="checkbox" />
        </div>
        <!--商品信息-->
        <div class="cart-item" v-for="(item,index) of list" :key="index">
            <div class="leftText">
                <input type="checkbox" v-model="item.cb"/>
                <div class="lname">{{item.lname}}</div>
                <div class="price">{{item.price}}</div>
            </div>
            <mt-button @click="delteItem" :data-id="item.id">删除</mt-button>
        </div>
        <!--汇总-->
        <div>
            购物车中商品数量
            <span style="color:red">0</span>
            <mt-button @click="delteItems">删除选中商品</mt-button>
            <mt-button>清空购物车</mt-button>
        </div>
    </div>
</template>

<script>
    export default{
        //组件创建成功后的回调函数
        created(){
            this.loadMore();
        },
        data(){
            return {
                list:[],//当前登录用户购物车列表
            }
        },
        methods:{
            //获取当前用户购物车列表
            loadMore(){
                var url="carts";
                this.axios.get(url).then(res=>{
                    if(res.data.code==-1)
                    {
                        this.$messagebox("消息","请登录").then(res=>{
                            this.$router.push("/Login");
                        });
                    }
                    else{
                        //this.list = res.data.data;
                        //遍历返回数据
                        for(var item of res.data.data)
                        {
                            item.cb = false;
                        }
                        this.list = res.data.data;
                    }
                });
            },
            delteItem(event){
                this.$messagebox.confirm("是否删除指定的数据").then(res=>{
                    //确定删除
                    var id = event.target.dataset.id;
                    var url="delItem";
                    var obj = {id:id};
                    this.axios.get(url,{params:obj}).then(res=>{
                        if(res.data.code == 1)
                        {
                            this.$toast("删除成功");
                            this.loadMore();
                        }
                        else{
                            this.$toast("删除失败");
                        }
                    });
                }).catch(err=>{});
            },
            delteItems(){
                this.$messagebox.confirm("是否删除指定商品").then(res=>{
                    var ids="";
                    for(var item of this.list)
                    {
                        if(item.cb)
                        {
                            ids+=item.id+",";
                        }
                    }
                    ids = ids.slice(0,-1);
                    console.log("To del items:"+ids);
                    if(ids=="")
                    {
                        this.$toast("请选择需要删除的商品");
                        return;
                    }
                    var url="delItems";
                    var obj={ids:ids};
                    this.axios.get(url,{params:obj}).then(res=>{
                        if(-1 == res.data.code)
                        {
                            this.$messagebox("消息","请登录").then(res=>{
                                this.$router.push("/Login");
                            });
                        }
                        else if(1 == res.data.code)
                        {
                            this.$toast("删除成功");
                            this.loadMore();
                        }
                        else {
                            this.$toast("删除失败");
                        }
                    });
                }).catch(err=>{});
            },
            selectAll(event)
            {
                //获取当前复选框的状态
                var cb = event.target.checked;
                for(var item of this.list)
                {
                    item.cb = cb;
                }
            },
        },
        props:{},
        components:{
        }
    }
</script>

<style scoped>
    .cart-item{
        display:flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:1px solid #ccc;
        margin-top: 25px;
    }
    .leftText{
        display: flex;
        align-items: center;
    }
    .lname{
        margin-left:25px;
    }
    .price{
        margin-left:25px;
    }
</style>