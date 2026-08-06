import axios from 'axios'
import qs from 'qs'
import { getUserToken, loginInvalid } from '../Utils/userLogin'
import { toHerf } from '../router/go'

/*
请求时处理
*/
const request = async config =>{
    //加载条开始
    window.$loadingBar.start();
    console.log("start request=>",config.url);
    //如果当前请求没有强制要求获取当前用户信息，则不获取
    if(config.userAuth)
    {
        config.headers.userToken = await getUserToken();
    }
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
    console.log("request error=>",error);
    //加载条异常结束
    window.$loadingBar.error();
    
    if(error.config)
    {
        //采用消息显示失败的原因
        //window.$message.error("发送"+error.config.name+"请求失败");
    }
    else{
        //window.$message.error(error);
    }
    //返回失败的原因
    return Promise.reject(error);
}

/*
响应处理
*/
const requestResponse = response =>{
    console.log("request response=>",response);
    //
    const responseData = response.data;
    //
    if(!responseData.success)
    {
        window.$loadingBar.error();
        //已知的系统级状态码（资源不存在 / 登录失效）由专属逻辑处理，不弹业务失败提示
        const systemStatus = responseData.status === 'RESOURCE_NOT_FOUND'
            || responseData.status === 'SERVICE_008'
            || responseData.status === 'SERVICE_012';
        //判断是否登陆失败
        if(responseData.status ==='SERVICE_008' || responseData.status ==='SERVICE_012')
        {
            console.log('[request interceptor]:login invalid')
            loginInvalid(true)
        }
        //判断是否资源未找到
        if(responseData.status ==='RESOURCE_NOT_FOUND')
        {
            console.log('[request interceptor]:resource not found')
            toHerf('/404');
        }
        //其他业务失败才弹出提示（如"查询用户信息失败"）
        if(!systemStatus)
        {
            window.$message.error(responseData.description)
        }
        
        return null;
    }
    window.$loadingBar.finish();
    //判断是否需要弹出成功消息 如登陆
    if(response.config.successMessage)
    {
        window.$message.success(response.config.name + "成功");
    }

    return responseData;
}

//自定义请求对象
const noteServerRequest = axios.create({
    baseURL:'/note-server'
})

//添加请求拦截器
noteServerRequest.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return request(config);
      }, function (error) {
        // 对请求错误做些什么
        return requestError(error);
    }
);

noteServerRequest.interceptors.response.use(
    response =>{
        return requestResponse(response)
    },
    error=>requestError(error)
);

//导出请求对象
export default noteServerRequest