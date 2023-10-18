<template>
    <div>
        <button @click="Delete">Delete</button>
        <button @click="handle1">显示交互式提示框</button>
        <button @click="handle2">显示确认框</button>
        <button @click="handle3">输入框</button>
        <div>
            <mt-field label="用户名" placeholder="请输入用户名" :attr="{maxlength:10}" v-model="uname"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="upwd"></mt-field>
            <mt-button size="large" @click="reg">用户注册</mt-button>
        </div>
        <br /><hr/>
        <div>
            <mt-switch v-model="val" @change="switch1">开关选项</mt-switch>
            <mt-radio title="单选列表" :options="['a','b','c']" v-model="opt"></mt-radio>
            <mt-radio title="单选列表1" :options="options" v-model="opt1"></mt-radio>
            <mt-button @click="GetVal">获取当前选项值</mt-button>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                uname:"",
                upwd:"",
                val:true,
                opt:"",
                opt1:"",
                options:[
                    {label:"去年",value:"24"},
                    {label:"今年",value:"23"},
                    {label:"明年",value:"22"}
                ]
            }
        },
        methods:{
            GetVal(){
                this.$toast({message:this.opt1});
            },
            switch1()
            {
                console.log(this.val);
            },
            reg()
            {
                //验证用户名 3~12位字母数字
                var regu = /^\w{3,12}$/i;
                //验证年龄2位数字
                var rega = /^\d{2}$/i;
                var u = this.uname;
                var p = this.upwd;
                if(!regu.test(u))
                {
                    this.$messagebox({message:"用户名格式不正确"});
                    return;
                }
                //if(!rega.test())

            },
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