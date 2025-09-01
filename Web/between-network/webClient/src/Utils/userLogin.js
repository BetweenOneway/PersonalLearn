import {useLoginModalStore} from '@/stores/loginModalStore'
import { useUserStore } from "@/stores/userStore"

//获取本地存储userToken的值 如果没有则显示登录窗口
export const getUserToken =async ()=>{
    //const token = localStorage.getItem("userToken")
    const {token} = useUserStore()
    if(token ===null)
    {
        console.log("登录失效，请重新登录！");
        //未登录
        const {changeLoginModalShow} = useLoginModalStore()

        await changeLoginModalShow(true)
    }
    else{
        return token
    }
}

//登录失效处理
export const loginInvalid = show=>{
    //重置用户状态
    const {resetUserInfo} = useUserStore()
    resetUserInfo()
    if(show)
    {
        const {changeLoginModalShow} = useLoginModalStore()
        changeLoginModalShow(true)
    }
}