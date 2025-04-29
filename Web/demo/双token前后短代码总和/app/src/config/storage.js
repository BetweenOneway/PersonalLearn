import * as constant from "./constant"

// 存储短token
export const setAccessToken = (token) => localStorage.setItem(constant.ACCESS_TOKEN, token)
// 存储长token
export const setRefershToken = (token) => localStorage.setItem(constant.REFRESH_TOKEN, token)
// 获取短token
export const getAccessToken = () => localStorage.getItem(constant.ACCESS_TOKEN)
// 获取长token
export const getRefershToken = () => localStorage.getItem(constant.REFRESH_TOKEN)
// 删除短token
export const removeAccessToken = () => localStorage.removeItem(constant.ACCESS_TOKEN)
// 删除长token
export const removeRefershToken = () => localStorage.removeItem(constant.REFRESH_TOKEN)