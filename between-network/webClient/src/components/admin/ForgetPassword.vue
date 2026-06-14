<template>
    <n-layout-content embeded class="p-6">
        <n-flex vertical align="center">
            <!--步骤条-->
            <n-steps :current="currentStep" status="process" class="w-10/12 p-3">
                <n-step v-for="step in steps" :key="step.title"
                    :title= step.title
                    :description= step.description
                />
            </n-steps>
            <!--表单和操作区-->
            <n-flex align="start">
                <!--表单-->
                <n-card class="w-96 shadow-lg" v-if="currentStep !== 3">
                    <template #header>
                        <n-h2 class="m-0 font-bold">忘记密码</n-h2>
                    </template>
                    <n-form ref="formRef" :model="formValue" :rules="formRules">
                        <n-form-item label="邮箱账号" path="email">
                            <n-input placeholder="请输入账号" v-model="formValue.email" :disalbed="currentStep === 2"></n-input>
                        </n-form-item>
                        <n-grid cols="3" x-gap="12" v-show="currentStep === 1">
                            <n-form-item-gi span="2" label="验证码" path="vc">
                                <n-input placeholder="请输入验证码" v-model="formValue.vc"></n-input>
                            </n-form-item-gi>
                            <n-form-item-gi >
                                <n-button block @click="getEmailVC">获取验证码</n-button>
                            </n-form-item-gi>
                        </n-grid>
                        <n-form-item label="新密码" v-show="currentStep === 2" path="password">
                            <n-input type="password" placeholder="请输入新密码" v-model="formValue.password"></n-input>
                        </n-form-item>
                        <n-form-item label="确认密码" v-show="currentStep === 2" path="confirmPassword">
                            <n-input type="password" placeholder="请确认新密码" v-model="formValue.confirmPassword"></n-input>
                        </n-form-item>
                        <n-form-item :show-label="false" :show-feedback="false">
                            <n-button block type="success" @click="submit">确定</n-button>
                        </n-form-item>
                    </n-form>
                </n-card>
                <!--密码新规-->
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
    //当前步数
    const currentStep = ref(1);

    const steps = [
        {
            title:'确认找回的账号',
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

    //表单值
    const formValue = reactive({
        email:'',//邮箱
        vc:'',//验证码
        password:'',//新密码
        confirmPassword:''//确认密码
    });

    //表单数据验证规则
    const formRules={
        email:{
            key:'email',
            message:"邮箱格式不正确",
            trigger:["input","blur"],
            validator:(rule,value)=>{
                var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                return reg.test(value)
            }
        },
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

    //表单引用
    const formRef = ref(null);

    //获取验证码的验证逻辑
    const getEmailVC = ()=>{
        formRef.value?.validate(
            error=>{},
            rule=>rule?.key === 'email'
        );
    }

    const submit = ()=>{
        if(currentStep.value === 1)
        {
            formRef.value?.validate(
                error=>{},
                rule=>rule?.key === 'email' || rule?.key === 'vc'
            );
        }
        else
        {
            formRef.value?.validate();
        }
    }
</script>

<style scoped></style>