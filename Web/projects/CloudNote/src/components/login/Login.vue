<template>
    <n-card>
        <n-space justify="space-between" align="center">
            <h2>登录</h2>
            <n-text depth="3">
                暂无账号？
                <n-button text type="info" @click="emits('changeStep',2)">去注册</n-button>
            </n-text>
        </n-space>
        <!--登录表单-->
        <n-form :model="loginFormValue" :rules="loginFormRules" ref="loginFormRef">
            <n-form-item label="邮箱" path="email" first>
                <n-input placeholder="请输入邮箱" v-model:value="loginFormValue.email">
                    <template #prefix>
                        <n-icon :component="EmailOutlined" />
                    </template>
                </n-input>
            </n-form-item>

            <n-form-item label="密码" path="password">
                <n-input placeholder="请输入密码" type="password" v-model:value="loginFormValue.password">
                    <template #prefix>
                        <n-icon :component="LockOpenOutlined" />
                    </template>
                </n-input>
            </n-form-item>

            <n-form-item :show-label="false" path="agreed">
                <n-checkbox v-model:checked="loginFormValue.agreed">同意</n-checkbox>
                <n-button text type="info">用户协议</n-button>
            </n-form-item>

            <n-form-item :show-label="false">
                <n-button type="success" block :disabled = "loginBtnDisabled" @click="toLogin">登录</n-button>
            </n-form-item>
        </n-form>

        <n-space justify="center" style="cursor:pointer">
            <n-text depth="3">忘记密码</n-text>
        </n-space>
    </n-card>
</template>

<script setup>
    import {EmailOutlined, LockOpenOutlined} from "@vicons/material"
    import {ref} from 'vue'
    import { noteBaseRequest } from "../../request/noteRequest"
    import {useMessage,useLoadingBar} from 'naive-ui'

    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    //自定义事件
    const emits = defineEmits(['changeStep']);

    //登录表单值
    const loginFormValue = ref({
        email:'',
        password:'',
        agreed:false
    })

    //登录表单验证规则
    const loginFormRules = {
        email:[
            {
                required:true,
                message:"邮箱不能为空",
                trigger:["input","blur"]
            },
            {
                message:"邮箱格式不正确",
                trigger:["input","blur"],
                validator:(rule,value)=>{
                    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                    return reg.test(value)
                }
            }
        ],
        password:{
            required:true,
            message:"密码不能为空",
            trigger:["input","blur"]
        },
        agreed:{
            message:"请先同意用户协议",
            trigger:"change",
            validator:(ruel,value)=>{
                return value
            }
        }
    }

    const loginFormRef = ref(null)

    //禁用登陆按钮
    const loginBtnDisabled = ref(false)

    //
    const toLogin = (e)=>{
        e.preventDefault();
        loginFormRef.value?.validate(async (errors) => {
          if (!errors) {
            //头部加载进度条开始
            loadingBar.start()
            loginBtnDisabled.value = true
            //发送登录请求
            const {data:responseData} = await noteBaseRequest.post(
                "/user/login",
                {
                    userEmail:loginFormValue.value.email,
                    userPassword:loginFormValue.value.password
                }
            ).catch(()=>{
                //发送请求失败
                loadingBar.error()//加载条异常结束
                message.error("发送登录请求失败")
                //解除禁用的登陆按钮
                setTimeout(()=>{
                    loginBtnDisabled.value = false
                },1500)

                throw "发送登录请求失败"
            })
            //处理返回数据
            console.log(responseData)
            
            if(responseData.success)
            {
                //加载条正常结束
                loadingBar.finish()
                //显示登陆成功的通知
                message.success(responseData.message)
            }
            else
            {
                //加载条异常结束
                loadingBar.error()
                //显示登陆失败的通知
                message.error(responseData.message)
            }

            //解除禁用的登陆按钮
            setTimeout(()=>{
                loginBtnDisabled.value = false
            },1500)

          } 
        });
    }
</script>