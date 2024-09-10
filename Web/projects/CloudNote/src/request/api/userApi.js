const userApi = {
    loginByMailPassword:{
        name:'邮箱密码登陆',
        url:'/user/login',
        method:'POST',
        userPower:false,
        dataParam:true,
        successMessage:true
    },
    emailRegister:{
        name:'邮箱注册',
        url:'/user/register',
        method:'POST',
        userPower:false,
        dataParam:true,
        successMessage:false
    }
}

export default userApi