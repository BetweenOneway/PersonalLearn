<template>
    <n-card>
        <n-space justify="space-between" align="center">
            <h2>登录</h2>
            <n-text depth="3">
                暂无账号？
                <n-button text type="info">去注册</n-button>
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
                <n-button type="success" block @click="toLogin">登录</n-button>
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

    const toLogin = (e)=>{
        e.preventDefault();
        loginFormRef.value?.validate((errors) => {
          if (!errors) {
            alert('登录成功')
          } 
        });
    }
</script>