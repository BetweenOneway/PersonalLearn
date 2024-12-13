<template>
    <el-container>
        <el-main class="login-container">
            <div class="login-card-container">
                <el-card class="login-card">
                    <el-space >
                        <el-link href="/" :underline="false">
                            <el-image style="width: 300px; height: 300px" :src="logoDarkImage"></el-image>
                        </el-link>
                    </el-space>
                    <el-form ref="registerForm" label-position="top" :model="registerInfo" :rules="registerFormRules" label-width="auto" style="max-width: 600px" class="login-form">
                        <el-form-item label="邮箱" class="input-item" prop="userName">
                            <el-input :prefix-icon="User" v-model="registerInfo.userName" style="width: 100%" placeholder="注册邮箱" class="input-no-border"/>
                        </el-form-item>
                        <el-form-item label="密码" class="input-item" prop="password">
                            <el-input :prefix-icon="Lock" class="input-no-border" v-model="registerInfo.password" style="width: 100%" type="password" placeholder="密码" show-password/>
                        </el-form-item>
                        <el-form-item label="确认密码" class="input-item" prop="confirmPassword">
                            <el-input :prefix-icon="Lock" class="input-no-border" v-model="registerInfo.confirmPassword" style="width: 100%" type="password" placeholder="再次输入密码" show-password/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :disabled="btnStatus.disabled" size="large" round class="button" @click="NewUserRegister(registerFormRef)">{{ btnStatus.text }}</el-button>
                        </el-form-item>
                    </el-form>
                    <el-row justify="space-between">
                        <el-link href="/user/login" :underline="false">
                            <span>已有账号？去登录</span>
                        </el-link>
                        <el-link href="/" :underline="false">
                            <span>忘记密码?</span>
                        </el-link>
                    </el-row>
                </el-card>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
    import { ref, useTemplateRef } from 'vue'
    import logoDarkImage from '@/assets/img/brand/dark.svg'
    import { User,Lock } from '@element-plus/icons-vue'
    import { ElMessage } from 'element-plus'
import { toHerf } from '@/router/go';

    const registerFormRef = useTemplateRef('registerForm');

    const registerInfo = ref({
        userName:'',
        password:'',
        confirmPassword:''
    })

    //注册表单验证规则
    const validatePass = (rule,value, callback) => {
        if (value === '') {
            callback(new Error('密码不能为空'))
        } else {
            if (registerInfo.value.confirmPassword !== '') {
                if (!registerFormRef.value) return
                registerFormRef.value.validateField('confirmPassword')
            }
            callback()
        }
    }

    const validatePass2 = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value !== registerInfo.value.password) {
            callback(new Error("两次输入密码不一致!"))
        } else {
            callback()
        }
    }

    const registerFormRules = {
        userName:[
            {
                required: true,
                message: '邮箱不能为空',
                trigger: 'blur',
            },
            {
                type: 'email',
                message: '邮箱格式不正确',
                trigger: ['blur', 'change'],
            },
        ],
        password: [
            { 
                required: true,
                validator: validatePass, 
                trigger: 'blur' 
            }
        ],
        confirmPassword: [
            {
                required: true,
                validator: validatePass2,
                trigger: 'blur' 
            }
        ],
    }

    const btnStatus = ref({
        text:'注册',
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
                btnStatus.value.text = btnStatus.value.time + '秒后再试'
            }
        },1000)
    }

    const resetBtnStatus = ()=>{
        clearInterval(btnStatus.value.clock);

        btnStatus.value.text = "注册"
        btnStatus.value.time = 60
        btnStatus.value.disabled = false
    }

    async function NewUserRegister(formEl)
    {
        

        let isValidateSuccess = false;
        //验证表单
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                console.log('submit!');
                isValidateSuccess = true
            } else {
                isValidateSuccess = false;
                console.log('error submit!', fields)
            }
        })

        btnCountDown();

        if(isValidateSuccess)
        {
            //发送请求
            //显示注册成功提示并跳转至登录界面
            ElMessage({
                message: '注册成功！即将跳转至登录界面.',
                type: 'success',
                onClose:()=>{
                    //此处写提示关闭后需要执行的函数
                    resetBtnStatus();
                    toHerf('/user/login')
                },
            })
        }
        else{
            resetBtnStatus();
        }
    }
</script>

<style scoped>
    @import url('@/assets/main.css');

    .login-container{
        background-color: #dde5f4;
    }
    .login-card-container{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .login-card{
        display: flex;
        flex-direction: column;
        background:#f1f7fe;
        border-radius: 30px;
        padding:2em;
    }

    .input-no-border :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        padding: 0;
    }

    .input-item{
        background: white;
        box-shadow: 0 0 2em #e6e9f9;
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        border-radius: 20px;
        color: #4d4d4d;
    }

    .input-no-border :deep(.el-input__inner:focus) {
        border-bottom: 1px solid #dde5f4;
    }

    .button {
        padding: 1em;
        width: 100%;
    }
</style>