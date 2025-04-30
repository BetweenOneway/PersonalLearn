import server from "./server"
import { ACCESS_TOKEN, REFRESH_TOKEN, PASS } from "../config/constant"
import { getRefershToken, removeAccessToken, removeRefershToken, setAccessToken } from '../config/storage'
let subscribes = []
let flag = false // 设置开关，保证一次只能请求一次短token，防止客户多点操作，多次请求
export const addRequest = (request) => {

    subscribes.push(request)

}

export const retryRequest = () => {
    console.log('重新请求上次中断的数据');
    subscribes.forEach(request => request())
    subscribes = []
}

// 验证长token 去请求新的短token
export const refreshToken = () => {

    if (!flag) {
        flag = true // 关闭开关
        let r_tk = getRefershToken() // 获取长token

        // 携带长token去请求短token
        server.get('/refresh', Object.assign({}, {
            headers: { [PASS]: r_tk }
        })).then((res) => {
            console.log("refreshToken res=>",res);
            // 长token失效，删除token，重新登录
            if (res.code === 4004) {
                flag = false
                removeRefershToken(REFRESH_TOKEN)
            } else if (res.code === 2002) { //长token有效，请求到新的token，重新存储
                // 存储新的短token
                setAccessToken(res.data.accessToken)
                flag = false
                // 重新请求数据
                retryRequest()
            }

        })

    }

}