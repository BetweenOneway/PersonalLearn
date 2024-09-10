const mailApi = {
    getRegisterVC:{
        name:'获取邮箱注册验证码',
        url:'/user/SendVerifyCode',
        method:'GET',
        userPower:false,
        dataParam:false,
        successMessage:true
    }
}

export default mailApi