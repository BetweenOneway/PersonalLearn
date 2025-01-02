import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginModalStore = defineStore(
    "login-modal",
    ()=>{
        //是否显示模态框
        const showLoginModal = ref(false)
        //显示哪个登录框
        //1 登录 2 注册 3 注册成功
        const loginModalStep = ref(1)

        const changeLoginModalShow = (show)=>{
            console.log("change login modal show=>",show);
            showLoginModal.value = show
        }

        return {loginModalStep,showLoginModal,changeLoginModalShow}
    }
)
