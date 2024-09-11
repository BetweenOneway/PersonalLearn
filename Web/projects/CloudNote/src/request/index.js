import axios from 'axios'
import qs from 'qs'
import { createDiscreteApi } from 'naive-ui'
import { getUserToken, loginInvalid } from '../Utils/userLogin'

//脱离上下文的消息和加载条对象
const { message, loadingBar } = createDiscreteApi(
    ['message', 'loadingBar']
)

/*
请求时处理
*/
const request = async config =>{
    //加载条开始
    loadingBar.start();
    //判断是否需要请求头中的userToken
    if(config.userPower) config.headers.userToken = await getUserToken();
    //是否需要将请求体中的参数转换成URL参数
    if(config.dataParam)
    {
        config.transformRequest=[(data)=>qs.stringify(data)]
    }
    return config;
}

/*
请求出错时处理
*/
const requestError = error =>{
    //加载条异常结束
    loadingBar.error();
    if(error.config)
    {
        //采用消息显示失败的原因
        message.error("发送"+error.config.name+"请求失败");
    }
    else{
        message.error(error);
    }
    //返回失败的原因
    //return Promise.reject(error);
}

/*
响应处理
*/
const requestResponse = response =>{
    //
    const responseData = response.data;
    //
    if(!responseData.success)
    {
        loadingBar.error();
        message.error(responseData.description)
        //判断是否登陆失败
        if(responseData.status ==='SERVICE_008')
        {
            loginInvalid(true)
        }
        console.log("login Invalid");
        return null;
    }
    loadingBar.finish();
    //判断是否需要弹出成功消息 如登陆
    if(response.config.successMessage)
    {
        message.success(response.config.name + "成功");
    }

    return responseData;
}

//自定义请求对象
const noteServerRequest = axios.create({
    baseURL:'/note-server'
})

//添加请求拦截器
noteServerRequest.interceptors.request.use(
    config=>request(config),
    error=>requestError(error)
);

noteServerRequest.interceptors.response.use(
    response =>{
        return requestResponse(response)
    },
    error=>requestError(error)
);

//导出请求对象
export default noteServerRequest