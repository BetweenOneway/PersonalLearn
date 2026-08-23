<template>
    <n-modal v-model:show="showLoginModal" :mask-closeable="false" transform-origin="center" :close-on-esc="false">
        <div class="login-modal-content">
            <Transition name="bounce" mode="out-in">
                <component :is="showLoginModalCard" @changeStep="changeLoginModalStep"/>
            </Transition>
        </div>
    </n-modal>
</template>

<script setup>
    import {computed} from 'vue'
    import {storeToRefs} from 'pinia'

    import Login from '@/components/login/Login.vue'
    import Register from '@/components/login/Register.vue'
    import RegisterSuccess from '@/components/login/RegisterSuccess.vue'
    import ForgotPassword from '@/components/login/ForgotPassword.vue'
    import {useLoginModalStore} from "@/stores/loginModalStore"

    //登录模态框 共享资源对象
    const loginModalStore = useLoginModalStore()

    //是否显示登录模态框
    const {showLoginModal,loginModalStep} = storeToRefs(loginModalStore)

    // //1 登录 2 注册 3 注册成功

    const showLoginModalCard = computed(()=>{
        switch(loginModalStep.value){
            case 1:
                return Login;
                break;
            case 2:
                return Register;
                break;
            case 3:
                return RegisterSuccess;
                break;
            case 4:
                return ForgotPassword;
                break;
            default:
                return Login;
                break;
        }
    })

    //
    const changeLoginModalStep = step=>{
        loginModalStep.value = step
    }

</script>

<style>
    .login-modal-content {
        width: 440px;
    }
    .bounce-enter-active {
        animation: bounce-in 0.5s;
    }
    .bounce-leave-active {
        animation: bounce-in 0.5s reverse;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.25);
        }
        100% {
            transform: scale(1);
        }
    }
</style>