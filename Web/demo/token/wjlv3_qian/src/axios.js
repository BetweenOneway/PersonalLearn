import axios from 'axios'; // 引入 axios 库，用于进行 HTTP 请求
import axiosRetry from 'axios-retry'; // 引入 axios-retry 库，用于实现请求重试机制
import router from './router'; // 引入 Vue Router 实例，用于页面导航

// 创建一个 axios 实例
export function createAxios(option = {}) {
    return axios.create({
        ...option, // 将传入的选项合并到 axios 实例中
    });
}

// 创建一个名为 houseApi 的 axios 实例，设置基本 URL 和超时时间
export const houseApi = createAxios({
    baseURL: 'http://localhost:18081/', // 设定基础 URL
    timeout: 5000, // 请求超时时间设置为 5000 毫秒（5 秒）
});

/**
 * 重试机制
 */
let retryCount = 0; // 初始化重试计数
const customRetryCondition = async (error) => {
  // 自定义重试条件
  if (axios.isAxiosError(error) && error.response?.status !== 200) {
    // 如果是 Axios 错误且响应状态不是 200
    if (error.response?.status === 403) {
        // 如果后端返回 403（禁止访问）
        localStorage.removeItem('accessToken'); // 移除 accessToken
        localStorage.removeItem('refreshToken'); // 移除 refreshToken
        console.log('请重新登录'); // 打印提示信息
        router.push('/login'); // 跳转到登录页面
        return false; // 不重试
    }

    if (error.response?.status === 401) {
      // 如果后端返回 401（未授权）
      await refresh(); // 尝试刷新 token
      console.log('刷新token'); // 打印提示信息
      return true; // 允许重试
    }

    retryCount++; // 增加重试计数
    console.log(`第${retryCount}次重试`); // 打印当前重试次数
    return (
      error.response.status >= 500 || // 如果响应状态是 500 或以上
      (error.response.status < 500 && error.response?.status !== 401) // 或者状态小于 500 但不等于 401
    );
  }
  return false; // 如果不符合条件，则不重试
};

// 配置 axios 实例的重试机制
axiosRetry(houseApi, {
  retries: 3, // 设置最多重试次数为 3 次
  retryCondition: customRetryCondition, // 使用自定义的重试条件
  retryDelay: axiosRetry.exponentialDelay, // 使用指数退避算法设置重试延迟
});

/**
 * 请求拦截器
 */
houseApi.interceptors.request.use(
    async function (config) {   
        console.log('开始请求'); // 打印请求开始信息
        const accessToken = localStorage.getItem('accessToken'); // 从 localStorage 获取 accessToken
        const refreshToken = localStorage.getItem('refreshToken'); // 从 localStorage 获取 refreshToken
        config.headers.accessToken = accessToken ? accessToken : ''; // 设置请求头中的 accessToken
        config.headers.refreshToken = refreshToken ? refreshToken : ''; // 设置请求头中的 refreshToken
        return config; // 返回配置
    },
    function (error) {
        return Promise.reject(error); // 拒绝请求错误
    }
);

/**
 * 响应拦截器
 */
houseApi.interceptors.response.use(
    async function (response) {
        if (response.status === 200) {
            return response; // 如果响应状态是 200，返回响应
        } else {
            return Promise.reject(response.data.message || '未知错误'); // 否则拒绝并返回错误信息
        }
    },
    function (error) {
        if (error && error.response) {
            // 如果有响应错误
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'; // 处理 400 错误
                    break;
                case 401:
                    error.message = '未授权，请重新登录'; // 处理 401 错误
                    break;
                case 403:
                    error.message = '拒绝访问'; // 处理 403 错误
                    localStorage.removeItem('accessToken'); // 移除 accessToken
                    localStorage.removeItem('refreshToken'); // 移除 refreshToken
                    router.push('/login'); // 跳转到登录页面
                    break;
                case 404:
                    error.message = '请求错误，未找到该资源'; // 处理 404 错误
                    break;
                case 405:
                    error.message = '请求方法未允许'; // 处理 405 错误
                    break;
                case 408:
                    error.message = '请求超时'; // 处理 408 错误
                    break;
                case 500:
                    error.message = '服务器端出错'; // 处理 500 错误
                    break;
                case 501:
                    error.message = '网络未实现'; // 处理 501 错误
                    break;
                case 502:
                    error.message = '网络错误'; // 处理 502 错误
                    break;
                case 503:
                    error.message = '服务不可用'; // 处理 503 错误
                    break;
                case 504:
                    error.message = '网络超时'; // 处理 504 错误
                    break;
                case 505:
                    error.message = 'http版本不支持该请求'; // 处理 505 错误
                    break;
                default:
                    error.message = `连接错误${error.response.status}`; // 处理其他未知错误
            }
        } else {
            error.message = '连接服务器失败'; // 如果没有响应，打印连接失败信息
        }
        return Promise.reject(error.message); // 拒绝并返回错误信息
    }
);

// 重新刷新token
async function refresh() {
    let res = await houseApi.get('/login/refresh'); // 发送请求以刷新 token
    localStorage.setItem('accessToken', res.data.accessToken); // 将新的 accessToken 存储到 localStorage
}

export default houseApi; // 导出 houseApi 实例
