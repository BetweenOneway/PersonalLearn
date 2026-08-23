<template>
    <n-card>
        <n-space justify="space-between" align="center">
            <h2>找回密码</h2>
            <n-text depth="3">
                想起来了？
                <n-button text type="info" @click="emits('changeStep',1)">去登录</n-button>
            </n-text>
        </n-space>

        <n-steps :current="currentStep" status="process" label-placement="horizontal" class="re-pwd-steps">
            <n-step v-for="step in steps" :key="step.title"
                :title= step.title
                :description= step.description
            />
        </n-steps>

        <!--第一步：确认账号信息（邮箱 + 验证码）-->
        <div v-if="currentStep === 1" class="re-pwd-form">
            <n-alert v-if="formErrorMsg" type="error" :title="formErrorMsg" closable @after-leave="formErrorMsg = ''" style="margin-bottom: 12px;" />
            <n-form ref="formRef" :model="formValue" :rules="formRules">
                <n-form-item label="邮箱账号" path="email">
                    <n-input placeholder="请输入账号" v-model:value="formValue.email"></n-input>
                </n-form-item>
                <n-grid cols="3" x-gap="12">
                    <n-form-item-gi span="2" label="验证码" path="vc">
                        <n-input placeholder="请输入验证码" v-model:value="formValue.vc"></n-input>
                    </n-form-item-gi>
                    <n-form-item-gi>
                        <n-button block @click="getEmailVC" :disabled="btnStatus.disabled">{{btnStatus.text}}</n-button>
                    </n-form-item-gi>
                </n-grid>
                <n-form-item :show-label="false" :show-feedback="false">
                    <n-button block type="success" @click="submitStep1">下一步</n-button>
                </n-form-item>
            </n-form>
        </div>

        <!--第二步：设置新密码-->
        <div v-if="currentStep === 2" class="re-pwd-form">
            <n-alert v-if="formErrorMsg" type="error" :title="formErrorMsg" closable @after-leave="formErrorMsg = ''" style="margin-bottom: 12px;" />
            <n-form ref="formRef" :model="formValue" :rules="formRules">
                <n-form-item label="邮箱账号" path="email">
                    <n-input placeholder="请输入账号" v-model:value="formValue.email" disabled></n-input>
                </n-form-item>
                <n-form-item label="新密码" path="password">
                    <n-input type="password" placeholder="请输入新密码" v-model:value="formValue.password">
                        <template #suffix>
                            <n-icon v-if="formValue.password && passwordRule.textMatch && passwordRule.length"
                                :component="CheckCircleOutlineOutlined" color="#18a058" />
                            <n-icon v-else-if="formValue.password"
                                :component="HighlightOffOutlined" color="#d03050" />
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item label="确认密码" path="confirmPassword">
                    <n-input type="password" placeholder="请确认新密码" v-model:value="formValue.confirmPassword">
                        <template #suffix>
                            <n-icon v-if="formValue.confirmPassword && formValue.confirmPassword === formValue.password"
                                :component="CheckCircleOutlineOutlined" color="#18a058" />
                            <n-icon v-else-if="formValue.confirmPassword"
                                :component="HighlightOffOutlined" color="#d03050" />
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item :show-label="false" :show-feedback="false">
                    <div class="re-pwd-rules">
                        <n-text :type="passwordRule.textMatch? 'success':'default'">1：新密码由字母、数字、特殊字符任意两种组成</n-text>
                        <n-text :type="passwordRule.length? 'success':'default'">2：新密码长度需在6-12位之间</n-text>
                    </div>
                </n-form-item>
                <n-form-item :show-label="false" :show-feedback="false">
                    <n-button block type="success" @click="submitStep2">确定</n-button>
                </n-form-item>
            </n-form>
        </div>

        <!--第三步：修改成功提示-->
        <n-result v-if="currentStep === 3"
            status="success"
            title="密码重置成功"
            description="您的登录密码已更新，请使用新密码重新登录。"
            class="re-pwd-form"
        >
            <template #footer>
                <n-button type="primary" @click="toLogin">重新登录</n-button>
            </template>
        </n-result>
    </n-card>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { useMessage } from 'naive-ui'
    import { CheckCircleOutlineOutlined, HighlightOffOutlined } from '@vicons/material'
    import noteServerRequest  from "@/request"
    import mailApi from "@/request/api/mailApi"
    import userApi from "@/request/api/userApi"
    import {useLoginModalStore} from "@/stores/loginModalStore"

    //自定义事件：切换登录模态框中的步骤（1 登录 2 注册 4 找回密码）
    const emits = defineEmits(['changeStep']);

    const message = useMessage()

    const loginModalStore = useLoginModalStore()

    const currentStep = ref(1);

    //验证码查询关键词
    const verifyCodeToken = ref("")

    //获取验证码按钮状态
    const btnStatus = reactive({
        text:'获取验证码',
        time:60,//倒计时剩余时间
        disabled:false, //是否禁用
        clock:null
    })

    const btnCountDown = ()=>{
        btnStatus.clock = setInterval(()=>{
            if(btnStatus.time == 1)
            {
                resetBtnStatus()
            }
            else
            {
                btnStatus.disabled = true
                btnStatus.time--
                btnStatus.text = btnStatus.time + '秒重新获取'
            }
        },1000)
    }

    const resetBtnStatus = ()=>{
        if(btnStatus.clock) clearInterval(btnStatus.clock);

        btnStatus.text = "获取验证码"
        btnStatus.time = 60
        btnStatus.disabled = false
    }

    const steps = [
        {
            title:'验证邮箱',
            description:'输入邮箱与验证码'
        },
        {
            title:'设置新密码',
            description:'按规则设置密码'
        },
        {
            title:'重置成功',
            description:'使用新密码登录'
        },
    ];

    const formValue = reactive({
        email:'',
        vc:'',
        password:'',
        confirmPassword:''
    });

    const formErrorMsg = ref('')

    const formRules = {
        email:[
            {
                key:'emailFormat',
                required:true,
                message:"邮箱不能为空",
                trigger:["input","blur"]
            },
            {
                key:'emailFormat',
                message:"邮箱格式不正确",
                trigger:["input","blur"],
                validator:(rule,value)=>{
                    var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    return reg.test((value || '').trim())
                }
            }
        ],
        vc:{
            key:'vc',
            required:true,
            message:"请输入验证码",
            trigger:["input","blur"]
        },
        password:{
            key:'password',
            required:true,
            message:"新密码格式不符",
            trigger:["input","blur"],
            validator:(rule,value)=>{
                var reg=/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,12}$/;
                return reg.test(value || '')
            }
        },
        confirmPassword:{
            key:'confirmPassword',
            required:true,
            message:"两次密码输入不一致",
            trigger:["input","blur"],
            validator:(rule,value)=>{
                return formValue.password === value;
            }
        },
    }

    const passwordRule = computed(()=>{
        const password = formValue.password;
        return {
            textMatch:/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{2,}$/.test(password),
            length:password.length >=6 && password.length <=12
        }
    });

    const formRef = ref(null);

    const getEmailVC = async ()=>{
        //仅校验邮箱格式
        try {
            await formRef.value?.validate(
                (errors) => {
                    if (errors) throw "表单验证失败"
                },
                (rule)=> rule?.key === 'emailFormat'
            )
        } catch (e) {
            return
        }

        btnCountDown();
        let API = {...mailApi.getChangePwdVC}
        API.params = {
            userEmail:formValue.email
        }
        noteServerRequest(API).then(responseData =>{
            if(!responseData) return;
            verifyCodeToken.value = responseData.data.userToken
        })
    }

    const submitStep1 = ()=>{
        formRef.value?.validate(
            (errors) => {
                if (errors) return;
                if(!verifyCodeToken.value)
                {
                    message.warning("请先获取验证码")
                    return
                }
                let API = {...userApi.verifyCode}
                API.data = {
                    userEmail: formValue.email,
                    verifyCode: formValue.vc,
                    verifyCodeKey: verifyCodeToken.value
                }
                noteServerRequest(API).then(responseData=>{
                    if(!responseData) return;
                    if(responseData.success)
                    {
                        currentStep.value = 2
                    }
                    else
                    {
                        formErrorMsg.value = responseData.description || "验证码不正确"
                    }
                })
            },
            rule=> rule?.key === 'emailFormat' || rule?.key === 'vc'
        );
    }

    const submitStep2 = ()=>{
        formRef.value?.validate(
            (errors) => {
                if (errors) return;
                if(formValue.password !== formValue.confirmPassword)
                {
                    message.warning("两次输入的密码不一致")
                    return
                }
                let API = {...userApi.resetPassword}
                API.data = {
                    userEmail: formValue.email,
                    verifyCode: formValue.vc,
                    verifyCodeKey: verifyCodeToken.value,
                    newPassword: formValue.password
                }
                noteServerRequest(API).then(responseData=>{
                    if(!responseData) return;
                    if(responseData.success)
                    {
                        //清空敏感信息
                        formValue.email = ''
                        formValue.vc = ''
                        formValue.password = ''
                        formValue.confirmPassword = ''
                        verifyCodeToken.value = ''
                        resetBtnStatus()
                        currentStep.value = 3
                    }
                    else
                    {
                        formErrorMsg.value = responseData.description || "密码重置失败"
                    }
                })
            }
        );
    }

    //回到登录步骤
    const toLogin = ()=>{
        emits('changeStep', 1)
    }
</script>

<style scoped>
    .re-pwd-steps {
        margin: 12px 0 20px;
    }
    .re-pwd-form {
        margin-top: 4px;
    }
    .re-pwd-rules {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        margin-bottom: 14px;
    }
</style>
