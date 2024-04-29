import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginModalStore = defineStore(
    "login-modal",
    ()=>{
        //是否显示模态框
        const showLoginModal = ref(false)

        const changeLoginModalShow = (show)=>{
            showLoginModal.value = show
        }

        return {showLoginModal,changeLoginModalShow}
    }
)
