<template>
    <div>
        <mt-field label="用户名" placeholder="请输入用户名" v-model="uname"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" v-model="upwd"></mt-field>
        <mt-button size="large" @click="login">登录</mt-button>
    </div>
</template>

<script>
    export default{
        data(){
        return {
            uname:"",
            upwd:""
        }
    },
    methods:{
        login(){
            var u = this.uname;
            var p = this.upwd;
            console.log(u+p);
            var reg=/^[a-z0-9A-Z]{3,12}$/i;
            if(!reg.test(u) || !reg.test(p))
            {
                this.$totast("用户名或密码格式不正确");
                return;
            }
            //这里要跟服务器对应
            var url = "login";
            var obj = {uname:u,upwd:p};
            this.axios.get(url,{params:obj}).then(res=>{
                //回调函数 接收服务器返回数据
                console.log(res);
                var code = res.data.code;
                if(code ==-1)
                {
                    this.$messagebox("消息","用户名或密码有误");
                    return;
                }
                else{
                    this.$router.push("/product");
                }
            });
        }
    },
    props:{},
        components:{
        }
    }
</script>

<style scoped>
</style>