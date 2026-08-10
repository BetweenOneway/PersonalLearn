<template>
    <n-layout-content embeded class="p-6">
        <n-flex vertical align="center">
            <n-steps :current="currentStep" status="process" class="w-10/12 p-3">
                <n-step v-for="step in steps" :key="step.title"
                    :title= step.title
                    :description= step.description
                />
            </n-steps>
            <n-flex align="start">
                <n-card class="w-96 shadow-lg" v-if="currentStep !== 3">
                    <template #header>
                        <n-h2 class="m-0 font-bold">修改密码</n-h2>
                    </template>
                    <n-form ref="formRef" :model="formValue" :rules="formRules">
                        <n-form-item label="邮箱账号" path="email">
                            <n-input placeholder="请输入账号" v-model:value="formValue.email" :disabled="currentStep === 2"></n-input>
                        </n-form-item>
                        <n-grid cols="3" x-gap="12" v-show="currentStep === 1">
                            <n-form-item-gi span="2" label="验证码" path="vc">
                                <n-input placeholder="请输入验证码" v-model:value="formValue.vc"></n-input>
                            </n-form-item-gi>
                            <n-form-item-gi >
                                <n-button block @click="getEmailVC" :disabled="!isEmailMatched || btnStatus.disabled">{{btnStatus.text}}</n-button>
                            </n-form-item-gi>
                        </n-grid>
                        <n-form-item label="新密码" v-show="currentStep === 2" path="password">
                            <n-input type="password" placeholder="请输入新密码" v-model:value="formValue.password"></n-input>
                        </n-form-item>
                        <n-form-item label="确认密码" v-show="currentStep === 2" path="confirmPassword">
                            <n-input type="password" placeholder="请确认新密码" v-model:value="formValue.confirmPassword"></n-input>
                        </n-form-item>
                        <n-form-item :show-label="false" :show-feedback="false">
                            <n-button block type="success" @click="submit">确定</n-button>
                        </n-form-item>
                    </n-form>
                </n-card>
                <n-alert v-if="currentStep === 2" :show-icon="false" title="新密码规则如下：">
                    <n-flex vertical :size="5">
                        <n-text :type="passwordRule.textMatch? 'success':'default'">1：新密码由字母、数字、特殊字符任意两种组成</n-text>
                        <n-text :type="passwordRule.length? 'success':'default'">2：新密码长度需在6-12位之间</n-text>
                    </n-flex>
                </n-alert>
                <!--第三步：修改成功提示-->
                <n-result v-if="currentStep === 3"
                    status="success"
                    title="密码修改成功"
                    description="您的登录密码已更新，请使用新密码重新登录。"
                >
                    <template #footer>
                        <n-button type="primary" @click="relogin">重新登录</n-button>
                    </template>
                </n-result>
            </n-flex>
        </n-flex>
    </n-layout-content>
</template>

<script setup>
    import { ref,reactive, computed } from 'vue';
    import { useUserStore } from "@/stores/userStore"
    import { storeToRefs } from 'pinia'
    import { useMessage } from 'naive-ui'
    import noteServerRequest  from "@/request"
    import mailApi from "@/request/api/mailApi"
    import userApi from "@/request/api/userApi"
    import { useLoginModalStore } from "@/stores/loginModalStore"

    const currentStep = ref(1);

    //当前登录用户共享信息
    const userStore = useUserStore()
    const { email: currentUserEmail } = storeToRefs(userStore)

    const message = useMessage()

    //验证码查询关键词
    const verifyCodeToken = ref("")

    //获取验证码按钮状态
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

    //判断输入的邮箱是否与当前登录用户邮箱一致
    const isEmailMatched = computed(()=>{
        return (formValue.email || '').trim().toLowerCase() === (currentUserEmail.value || '').trim().toLowerCase()
    })

    const steps = [
        {
            title:'确认账号信息',
            description:'输入邮箱验证码，确认账号信息'
        },
        {
            title:'设置新密码',
            description:'根据密码规则，设置新密码'
        },
        {
            title:'修改成功',
            description:'修改成功，重新登录'
        },
    ];

    const formValue = reactive({
        email:'',
        vc:'',
        password:'',
        confirmPassword:''
    });

    const formRules={
        email:[
            {
                key:'emailFormat',
                message:"邮箱格式不正确",
                trigger:["input","blur"],
                validator:(rule,value)=>{
                    var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    return reg.test((value || '').trim())
                }
            },
            {
                key:'emailMatch',
                message:"邮箱与当前登录用户不一致",
                trigger:["input","blur"],
                validator:(rule,value)=>{
                    return (value || '').trim().toLowerCase() === (currentUserEmail.value || '').trim().toLowerCase();
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
            message:"请输入符合要求的密码",
            trigger:["input","blur"],
            validator:(rule,value)=>{
                var reg=/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,12}$/;
                return reg.test(value);
            }
        },
        confirmPassword:{
            key:'vc',
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
        //邮箱与当前登录用户不一致时，禁止发送验证码
        if(!isEmailMatched.value)
        {
            message.warning("输入的邮箱与当前登录用户邮箱不一致，无法获取验证码")
            return
        }
        //表单邮箱格式校验
        await formRef.value?.validate(
            (errors) => {
                if (errors) {
                    throw "表单验证失败"
                }
            },
            //仅校验邮箱格式规则
            (rule)=>{
                return rule?.key === 'emailFormat';
            }
        );

        btnCountDown();
        //获取请求API
        let API = {...mailApi.getChangePwdVC}
        API.params = {
            userEmail:formValue.email
        }

        //发送请求
        noteServerRequest(API).then(responseData =>{
            if(!responseData) return;
            //存储验证码关键词
            verifyCodeToken.value = responseData.data.userToken
        })
    }

    const submit = ()=>{
        if(currentStep.value === 1)
        {
            //邮箱与当前登录用户不一致时，禁止继续修改密码
            if(!isEmailMatched.value)
            {
                message.warning("输入的邮箱与当前登录用户邮箱不一致，请检查后重试")
                return
            }
            //校验邮箱格式、邮箱匹配、验证码是否已填写
            formRef.value?.validate(
                (errors) => {
                    if (errors) return;
                    //未获取验证码时禁止进入下一步
                    if(!verifyCodeToken.value)
                    {
                        message.warning("请先获取验证码")
                        return
                    }
                    //向服务器校验验证码是否正确
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
                            //验证码匹配，进入第二步
                            currentStep.value = 2
                        }
                        else
                        {
                            //验证码不匹配或已过期，给出相应提示
                            message.warning(responseData.description || "验证码不正确")
                        }
                    })
                },
                rule=>rule?.key === 'emailFormat' || rule?.key === 'emailMatch' || rule?.key === 'vc'
            );
        }
        else
        {
            //第二步：校验新密码与确认密码，并提交修改
            formRef.value?.validate(
                (errors) => {
                    if (errors) return;
                    if(formValue.password !== formValue.confirmPassword)
                    {
                        message.warning("两次输入的密码不一致")
                        return
                    }
                    //提交修改密码请求
                    let API = {...userApi.changePassword}
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
                            //修改成功，进入第三步“修改成功”页面
                            //先清空表单与验证码，避免敏感信息遗留
                            formValue.email = ''
                            formValue.vc = ''
                            formValue.password = ''
                            formValue.confirmPassword = ''
                            verifyCodeToken.value = ''
                            btnStatus.value.disabled = false
                            currentStep.value = 3
                        }
                    })
                }
            );
        }
    }

    //重新登录：清空当前登录态并弹出登录框
    const relogin = ()=>{
        userStore.resetUserInfo()
        const loginModalStore = useLoginModalStore()
        loginModalStore.loginModalStep = 1
        loginModalStore.changeLoginModalShow(true)
    }
</script>

<style scoped></style>
