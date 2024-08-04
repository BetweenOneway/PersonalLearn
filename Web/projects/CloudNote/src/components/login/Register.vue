<template>
    <n-card>
        <n-space justify="space-between" align="center">
            <h2>注册</h2>
            <n-text depth="3">
                已有账号？
                <n-button text type="info" @click="emits('changeStep',1)">去登录</n-button>
            </n-text>
        </n-space>
        <!--注册表单-->
        <n-form :model="registerFormValue" :rules="registerFormRules" ref="registerFormRef">
            <n-form-item label="邮箱" path="email" first>
                <n-input placeholder="请输入邮箱" v-model:value="registerFormValue.email">
                    <template #prefix>
                        <n-icon :component="EmailOutlined" />
                    </template>
                </n-input>
            </n-form-item>

            <n-grid :cols="2" :x-gap="24">
                <n-form-item-gi label="验证码" path="verifyCode">
                    <n-input placeholder="请输入验证码" v-model:value="registerFormValue.verifyCode">
                    </n-input>
                </n-form-item-gi>
                <n-form-item-gi>
                    <n-button block tertiary type="success" :disabled="btnStatus.disabled" @click="getEmailVC">{{btnStatus.text}}</n-button>
                </n-form-item-gi>
            </n-grid>

            <n-form-item :show-label="false" path="agreed">
                <n-checkbox v-model:checked="registerFormValue.agreed">同意</n-checkbox>
                <n-button text type="info">用户协议</n-button>
            </n-form-item>

            <n-form-item :show-label="false">
                <n-button type="success" :disabled = "registerBtnDisabled" block @click="toRegister">注册</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>

<script setup>
    import {EmailOutlined, LockOpenOutlined} from "@vicons/material"
    import {ref} from 'vue'
    import { noteBaseRequest } from "../../request/noteRequest"
    import {useMessage,useLoadingBar} from 'naive-ui'
    import {disabledBtn} from '../../utils/disabledBtn'

    //消息对象
    const message = useMessage()
    //进度条对象
    const loadingBar = useLoadingBar()

    //验证码查询关键词
    const emailVerifyCodeToken = ref("")

    //自定义事件
    const emits = defineEmits(['changeStep']);

    //注册表单值
    const registerFormValue = ref({
        email:'',
        verifyCode:'',
        agreed:false
    })

    //注册表单验证规则
    const registerFormRules = {
        email:[
            {
                required:true,
                message:"邮箱不能为空",
                trigger:["input","blur"]
            },
            {
                key:'mail',
                message:"邮箱格式不正确",
                trigger:["input","blur"],
                validator:(rule,value)=>{
                    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                    return reg.test(value)
                }
            }
        ],
        verifyCode:{
            required:true,
            message:"请输入验证码",
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

    const registerFormRef = ref(null)

    const registerBtnDisabled = ref(false)

    const toRegister = (e)=>{
        e.preventDefault();
        registerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            //是否已经获取过验证码
            const verifyCodeKey = emailVerifyCodeToken.value
            if(verifyCodeKey === "" || verifyCodeKey === null)
            {
                console.log(verifyCodeKey)
                throw message.error("请先获取验证码")
            }
            console.log(verifyCodeKey)
            //判断接收验证码邮箱是否与注册邮箱一致
            const vc_email = verifyCodeKey.split(":")[1]//获取验证码的邮箱
            const email = registerFormValue.value.email;//注册邮箱
            if(email !== vc_email)
            {
                throw message.error("注册邮箱账号发生改变")
            }
            //头部加载进度条开始
            loadingBar.start()
            //禁用按钮
            disabledBtn(registerBtnDisabled,true);
            //发送注册请求
            const {data:responseData} = await noteBaseRequest.post(
                "/user/register",
                {
                    userEmail:email,
                    verifyCode:registerFormValue.value.verifyCode,
                    verifyCodeKey:verifyCodeKey
                }
            ).catch(()=>{
                //发送请求失败
                loadingBar.error()//加载条异常结束
                message.error("发送注册请求失败")
                //解除禁用的登陆按钮
                disabledBtn(registerBtnDisabled,false,true,1.5);

                throw "发送注册请求失败"
            })
            //处理返回数据
            console.log(responseData)
            
            if(responseData.success)
            {
                //加载条正常结束
                loadingBar.finish()
                //跳转到注册成功的界面
                emits('changeStep',3)
            }
            else
            {
                //加载条异常结束
                loadingBar.error()
                //显示注册失败的通知
                message.error(responseData.description)
                //解除禁用的登陆按钮
                disabledBtn(registerBtnDisabled,false,true,1.5);
            }
          } 
        });
    }

    const btnStatus = ref({
        text:'获取验证码',
        time:60,//倒计时剩余时间
        disabled:false, //是否禁用
        clock:null
    })

    const btnCountDown = ()=>{
        btnStatus.value.clock = setInterval(()=>{
            if(btnStatus.value.time == 1)
            {
                //重置按钮状态
                resetBtnStatus()
            }
            else
            {
                //需要倒计时
                btnStatus.value.disabled = true
                btnStatus.value.time--
                btnStatus.value.text = btnStatus.value.time + '秒重新获取'
            }
        },1000)
    }

    const resetBtnStatus = ()=>{
        clearInterval(btnStatus.value.clock);

        btnStatus.value.text = "获取验证码"
        btnStatus.value.time = 60
        btnStatus.value.disabled = false
    }

    const getEmailVC = ()=>{
        registerFormRef.value?.validate(
            async (errors) => {
                if (!errors) {
                    btnCountDown()
                    //发送获取验证码请求
                    loadingBar.start()
                    const {data:responseData} = await noteBaseRequest.get(
                        "/user/SendVerifyCode",
                        {
                            params:{
                                userEmail:registerFormValue.value.email
                            }
                        }
                    ).catch(()=>{
                        //发送请求失败
                        loadingBar.error()//加载条异常结束
                        message.error("获取验证码失败")

                        throw "获取验证码失败"
                    })

                    //处理返回数据
                    console.log(responseData)
                    
                    if(responseData.success)
                    {
                        //加载条正常结束
                        loadingBar.finish()
                        //显示获取成功的通知
                        message.success(responseData.description)

                        emailVerifyCodeToken.value = responseData.data.userToken
                    }
                    else
                    {
                        //加载条异常结束
                        loadingBar.error()
                        //显示获取验证码失败的通知
                        message.error(responseData.description)
                    }
                } 
            },
            (rule)=>{
                return rule?.key === 'mail';
            }
        );
    }
</script>