import axios from "axios";
import * as storage from "../config/storage"
import * as constant from '../config/constant'
import { addRequest, refreshToken } from "./refresh";
const server = axios.create({

    baseURL: '/api', // 服务器代理
    timeout: 500000,
    headers: {
        "Content-type": "application/json"
    }
})

// 请求拦截器
server.interceptors.request.use(config => {
    console.log("request interceptor")
    // 获取短token，携带到请求头，服务端校验
    let aToken = storage.getAccessToken(constant.ACCESS_TOKEN)
    config.headers[constant.AUTH] = aToken
    return config
})

// 响应拦截器
server.interceptors.response.use(

    async response => {

        // 获取到配置和后端响应的数据
        let { config, data } = response
        console.log('响应提示信息：', data.msg);
        console.log('响应提示码：', data.code);
        return new Promise((resolve, reject) => {
            // 短token失效
            if (data.code === 4003) {
                // 移失效的短token
                storage.removeAccessToken(constant.ACCESS_TOKEN)
                // 把请求数据的 配置存储起来，用于请求到新的短token，再次请求数据，达到无感刷新token
                addRequest(() => resolve(server(config)))
                // 携带长token去请求新的token
                refreshToken()

            } else {
                // 有效返回相应的数据
                resolve(data)
            }

        })

    },
    error => {
        return Promise.reject(error)
    }
)
export default server
