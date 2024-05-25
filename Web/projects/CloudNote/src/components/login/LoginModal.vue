<template>
    <n-modal v-model:show="showLoginModal" :mask-closeable="false" transform-origin="center" :close-on-esc="false">
        <div style="width:420px">
            <Transition name="bounce" mode="out-in">
                <component :is="showLoginModalCard" @changeStep="changeLoginModalStep"/>
            </Transition>
        </div>
    </n-modal>
</template>

<script setup>
    import {ref,computed} from 'vue'
    import {storeToRefs} from 'pinia'

    import Login from '../login/Login.vue'
    import Register from '../login/Register.vue'
    import RegisterSuccess from '../login/RegisterSuccess.vue'
    import {useLoginModalStore} from "../../stores/loginModalStore"

    //登录模态框 共享资源对象
    const loginModalStore = useLoginModalStore()

    //是否显示登录模态框
    const {showLoginModal} = storeToRefs(loginModalStore)

    //1 登录 2 注册 3 注册成功
    const loginModalStep = ref(1)

    const showLoginModalCard = computed(()=>{
        switch(loginModalStep.value){
            case 1:
                return Login;
                break;
            case 2:
                return Register;
                break;
            default:
                return RegisterSuccess;
                break;
        }
    })

    //
    const changeLoginModalStep = step=>{
        loginModalStep.value = step
    }
</script>

<style>
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