/**
 * 没网的处理逻辑
 */
function handleOffline(error) {
  Object.assign(error, {
    code: 0,
    message: '网络错误',
  });
  // 消息提醒，比如element的 message.error()
  console.log(error);
}

/**
 * 403的处理逻辑
 */
function handle403(error) {
  Object.assign(error, {
    code: 403,
    message: '权限出错，请返回登录页面重新登录',
  });
  // 消息提醒，比如element的 message.error()
  console.log(error);
  //   清除缓存，跳转登录页
}

/**
 * 敏感词的处理逻辑
 */
function handle1002(error) {
  Object.assign(error, {
    code: 1002,
    message: error.message,
  });
  // 消息提醒，比如element的 message.error()
  console.log(error);
  //   清除缓存，跳转登录页
}
