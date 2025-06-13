/**
 * 执行AJAX请求
 * @param {string} url 请求的URL
 * @param {string} type 请求类型（如GET、POST等）
 * @param {Object|string} data 要发送的数据
 * @returns {Promise} 返回一个Promise对象，成功时resolve响应结果，失败时reject错误对象
 */
const baseUrl = 'http://localhost:8080';
function ajaxFunc({ url, type = 'get', data }) {
  const realUrl = baseUrl + url;
  // 创建一个新的Promise，通过$.ajax来处理异步请求
  return new Promise((resolve, reject) => {
    $.ajax({
      url: realUrl,
      type,
      data,
      // 请求成功时调用的回调函数
      success: function (res) {
        resolve(res);
      },
      // 请求失败时调用的回调函数
      error: function (err) {
        reject(err);
      },
    });
  });
}

async function a() {
  try {
    const res = await ajaxFunc({
      url: '/ok',
      type: 'get',
      data: {
        name: 'zhangsan',
        age: 18,
      },
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

a();
