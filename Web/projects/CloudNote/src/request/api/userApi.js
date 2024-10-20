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
    },
    logout:{
        name:'退出登陆',
        url:'/user/logout',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    }
}

export default userApi