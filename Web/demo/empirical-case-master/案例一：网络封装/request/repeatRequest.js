/**
 * 记录当前 请求中的 请求中
 * 用于取消重复请求
 */

// 记录请求中的请求，url为key，axiosConfig作为值，请求后的值作为value
const pendingRequest = new Map();

/**
 *添加进请求中的对象中
 * @param {*} config
 * @returns
 */
function addPendingRequest(config) {
  const requestKey = generateReqConfig(config);
  if (requestKey && !pendingRequest.has(requestKey)) {
    pendingRequest.set(requestKey, null);
  }
  console.log('添加请求中请求', pendingRequest);
}

/**
 * 设置请求中的对象，把成功请求放进去
 */
function setSuccessRequest(config, data) {
  const requestKey = generateReqConfig(config);
  pendingRequest.set(requestKey, data);
  console.log('请求成功，设置数据', pendingRequest);

  // 1s后，删除请求中数据，释放内存
  setTimeout(() => {
    deletePendingRequest(config, requestKey);
  }, 500);
}

/**
 * 删除请求中数据
 */
function deletePendingRequest(config, requestKey) {
  if (!requestKey) {
    requestKey = generateReqConfig(config);
  }
  console.log('删除数据', pendingRequest);
  pendingRequest.delete(requestKey);
}

/**
 * 获取成功的请求参数
 * @param {*} config
 * @param {*} requestKey
 * @returns
 */
function getSuccessRequest(config, requestKey) {
  if (!requestKey) {
    requestKey = generateReqConfig(config);
  }
  console.log('获取数据', pendingRequest);
  return pendingRequest.get(requestKey);
}

// 用于根据当前请求的信息，生成请求 Key；
function generateReqConfig(config) {
  const { type, url, data } = config; // 请求方式，参数，请求地址，
  if (data instanceof FormData) {
    return;
  }
  const dataStr = JSON.stringify(data);
  return [url, type, dataStr].join(',');
}
