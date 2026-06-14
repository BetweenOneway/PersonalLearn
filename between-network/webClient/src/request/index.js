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
        window.$message.error(responseData.description)
        //判断是否登陆失败
        if(responseData.status ==='SERVICE_008' || responseData.status ==='SERVICE_012')
        {
            loginInvalid(true)
        }
        //判断是否资源未找到
        if(responseData.status ==='RESOURCE_NOT_FOUND')
        {
            toHerf('/404');
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