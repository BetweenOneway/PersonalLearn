import axios from 'axios'
import qs from 'qs'

const request = config =>{
    //加载条开始
    //
    //是否需要将请求体中的参数转成URL的参数
}

//自定义请求对象
const noteServerRequest = axios.create({
    baseURL:'/note-server'
})

//添加请求拦截器
noteServerRequest.interceptors.request.use(
    config=>{

    },
    error=>{

    }
);

noteServerRequest.interceptors.response.use(
    response=>{

    },
    error=>{

    }
);

//导出请求对象
export default noteServerRequest