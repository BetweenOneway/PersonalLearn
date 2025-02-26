import {useLoginModalStore} from '../stores/loginModalStore'
import { useUserStore } from "../stores/userStore"

//获取本地存储userToken的值 如果没有则显示登录窗口
export const getUserToken =async ()=>{
    //const token = localStorage.getItem("userToken")
    const {token} = useUserStore()
    if(token ===null)
    {
        //未登录
        const {changeLoginModalShow} = useLoginModalStore()

        await changeLoginModalShow(true)

        throw "登录失效"
    }
    else{
        return token
    }
}

//登录失效处理
export const loginInvalid = show=>{
    // const userToken = localStorage.getItem("userToken")
    // //userToken本地存储删除
    // localStorage.removeItem(userToken)

    //重置用户状态
    const {resetUserInfo} = useUserStore()
    resetUserInfo()
    if(show)
    {
        const {changeLoginModalShow} = useLoginModalStore()
        changeLoginModalShow(true)
    }
}