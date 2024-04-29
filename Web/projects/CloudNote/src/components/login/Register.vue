<template>
    <n-card>
        <n-space justify="space-between" align="center">
            <h2>注册</h2>
            <n-text depth="3">
                已有账号？
                <n-button text type="info">去登录</n-button>
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
                <n-button type="success" block @click="toRegister">注册</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>

<script setup>
    import {EmailOutlined, LockOpenOutlined} from "@vicons/material"
    import {ref} from 'vue'

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

    const toRegister = (e)=>{
        e.preventDefault();
        registerFormRef.value?.validate((errors) => {
          if (!errors) {
            alert('注册成功')
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
            (errors) => {
                if (!errors) {
                    btnCountDown()
                } 
            },
            (rule)=>{
                return rule?.key === 'mail';
            }
        );
    }
</script>