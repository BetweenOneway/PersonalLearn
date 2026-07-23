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
                                <n-button block @click="getEmailVC" :disabled="!isEmailMatched">获取验证码</n-button>
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
            </n-flex>
        </n-flex>
    </n-layout-content>
</template>

<script setup>
    import { ref,reactive, computed } from 'vue';
    import { useUserStore } from "@/stores/userStore"
    import { storeToRefs } from 'pinia'
    import { useMessage } from 'naive-ui'

    const currentStep = ref(1);

    //当前登录用户共享信息
    const userStore = useUserStore()
    const { email: currentUserEmail } = storeToRefs(userStore)

    const message = useMessage()

    //判断输入的邮箱是否与当前登录用户邮箱一致
    const isEmailMatched = computed(()=>{
        return formValue.email.trim().toLowerCase() === (currentUserEmail.value || '').trim().toLowerCase()
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
                    return value.trim().toLowerCase() === (currentUserEmail.value || '').trim().toLowerCase();
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

    const getEmailVC = ()=>{
        //邮箱与当前登录用户不一致时，禁止发送验证码
        if(!isEmailMatched.value)
        {
            message.warning("输入的邮箱与当前登录用户邮箱不一致，无法获取验证码")
            return
        }
        formRef.value?.validate(
            error=>{},
            rule=>rule?.key === 'emailFormat' || rule?.key === 'emailMatch'
        );
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
            formRef.value?.validate(
                error=>{},
                rule=>rule?.key === 'emailFormat' || rule?.key === 'emailMatch' || rule?.key === 'vc'
            );
        }
        else
        {
            formRef.value?.validate();
        }
    }
</script>

<style scoped></style>
