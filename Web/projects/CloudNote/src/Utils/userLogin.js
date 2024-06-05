import {useLoginModalStore} from '../stores/loginModalStore'

//获取本地存储userToken的值 如果没有则显示登录窗口
export const getUserToken =async ()=>{
    const token = localStorage.getItem("userToken")
    if(token ===null)
    {
        //未登录
        const {changeLoginModalStatus} = useLoginModalStore()
        await changeLoginModalStatus(true)
        throw "未登录"
    }
    else{
        return token
    }
}