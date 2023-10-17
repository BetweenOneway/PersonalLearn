<template>
    <div>
        <button @click="Delete">Delete</button>
        <button @click="handle1">显示交互式提示框</button>
        <button @click="handle2">显示确认框</button>
        <button @click="handle3">输入框</button>
        <div>
            <mt-field label="用户名" placeholder="请输入用户名" :attr="{maxlength:10}" v-model="uname"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="upwd"></mt-field>
            <mt-button size="large">用户注册</mt-button>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {uname:"",upwd:""}
        },
        methods:{
            handle3(){
                this.$messagebox.prompt("请输入年龄：")
                .then(value=>{
                    //确认回调
                    console.log(value)
                })
                .catch(err=>{
                    //取消回调
                    console.log(err)
                })
            },
            handle1(){
                //this.$messagebox("Info","数据加载成功");
                this.$messagebox("","数据加载成功");
            },
            handle2(){
                this.$messagebox.confirm("是否删除指定数据")
                .then(res=>{console.log(res)})
                .catch(err=>{console.log(err)})

                this.$messagebox.confirm("是否删除指定数据2")
                .then(res=>{console.log(res)})
                .catch(err=>{console.log(err)})
            },
            Delete(){
                this.$toast(
                    {
                        message:"删除成功！",
                        //duration:-1表示永不消失
                        position:"bottom",
                        iconClass:"iconfont icon-chenggong"
                    });
            }
        }
    }
</script>