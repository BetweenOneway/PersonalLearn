/**
 * 执行AJAX请求
 * @param {string} url 请求的URL
 * @param {string} type 请求类型（如GET、POST等）
 * @param {Object|string} data 要发送的数据
 * @returns {Promise} 返回一个Promise对象，成功时resolve响应结果，失败时reject错误对象
 */
const baseUrl = 'http://localhost:8080';
function ajaxFunc(config) {
  const { url, type = 'get', data, headers } = config;
  const realUrl = baseUrl + url;

  return new Promise((resolve, reject) => {
    // 判断重复请求
    let timer = null;
    const requestKey = generateReqConfig(config);
    if (requestKey && pendingRequest.has(requestKey)) {
      // 再次循环查询第一个请求的是否返回数据回来，返回有三种
      // 1. undefined，标识没有这个请求中的请求了，那么代表第一个请求是错误的，直接返回报错回去
      // 2. null，表示第一个请求还在请求中
      // 3. 有值，表示第一个成功，直接服用数据
      timer = setInterval(() => {
        const data = getSuccessRequest(config, requestKey);
        if (data === undefined) {
          clearInterval(timer);
          reject();
        }
        if (data) {
          clearInterval(timer);
          resolve(data);
        }
      }, 300);
      return;
    }

    // 请求拦截器
    if (requestInterceptor(config) === false) {
      return reject();
    }
    $.ajax({
      url: realUrl,
      type,
      data,
      success: async function (responseData) {
        // 响应拦截器：请求成功
        try {
          const result = await responseInterceptorSuccess(responseData);
          // 请求成功，设置请求中数据
          setSuccessRequest(config, result);
          resolve(result);
        } catch (error) {
          deletePendingRequest(config);
          reject(error);
        }
      },
      error: function (response) {
        //  响应拦截器：请求失败
        responseInterceptorError(response);
        deletePendingRequest(config);
        // 把响应数据返回出去，页面如果要处理，可以获取
        reject(response.responseJSON);
      },
    });
  });
}

/**
 * 请求拦截器
 * @param {Object} config
 * @return false 表示取消请求
 */
function requestInterceptor(config) {
  addPendingRequest(config);

  return config;
}

/**
 * 响应拦截器：请求成功，返回2xx的code
 * @param {Object} response
 */
function responseInterceptorSuccess(responseData) {
  // 判断请求是否一个文件流
  if (typeof responseData !== 'object') {
    return Promise.resolve(responseData);
  }
  // 成功
  if (responseData.code === 0) {
    return Promise.resolve(responseData);
  }
  // 逻辑报错
  if (responseData.code === 1001) {
    handle1002(responseData);
    return Promise.reject(responseData);
  }
  //   最后统一处理
  // 消息提醒，比如element的 message.error()
  console.log(responseData);
  return Promise.reject(responseData);
}

/**
 * 响应拦截器：请求失败，即返回除了2xx外的code
 * @param {Object} response
 */
function responseInterceptorError(response) {
  const httpCode = response.status;
  const error = {
    type: 'http',
    code: httpCode,
    message: '请求出错',
  };
  if (!window.navigator.onLine) {
    // 网路错误
    handleOffline(error);
    return;
  }
  if (httpCode === 403) {
    handle403(error);
    return;
  }
  //   后面可以接上其他的处理逻辑

  //   最后统一处理
  // 消息提醒，比如element的 message.error()
  console.log(error);
}
