const mailApi = {
    getRegisterVC:{
        name:'获取邮箱注册验证码',
        url:'/user/SendVerifyCode',
        method:'GET',
        userAuth:false,
        dataParam:false,
        successMessage:true
    },
    getChangePwdVC:{
        name:'获取修改密码验证码',
        url:'/user/SendChangePasswordVC',
        method:'GET',
        userAuth:false,
        dataParam:false,
        successMessage:true
    }
}

export default mailApi