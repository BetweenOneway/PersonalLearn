REDIS_STATUS={
    SET_SUCCESS:{
        success:true,
        status:'CACHE_000',
        description:'缓存设置成功'
    },
    DEL_SUCCESS:{
        success:true,
        status:'CACHE_001',
        description:'缓存删除成功'
    },
    GET_SUCCESS:{
        success:true,
        status:'CACHE_002',
        description:'缓存查询成功'
    },
    SET_FAIL:{
        success:false,
        status:'CACHE_003',
        description:'缓存设置失败'
    },
    DEL_FAIL:{
        success:false,
        status:'CACHE_004',
        description:'缓存删除失败'
    },
    GET_FAIL:{
        success:false,
        status:'CACHE_005',
        description:'缓存查询失败'
    },
    PARAM_ERROR:{
        success:false,
        status:'CACHE_006',
        description:'请求参数有误'
    }
}

DB_STATUS={
    SELECT_FAIL:{
        success:false,
        status:'DB_001',
        description:'数据库查询失败'
    },
    UPDATE_SUCCESS:{},
    DEL_SUCCESS:{},
    PARAM_ERROR:{
        success:false,
        status:'DB_006',
        description:'请求参数有误'
    },
    INSERT_ERROR:{
        success:false,
        status:'DB_007',
        description:'数据库新增记录失败'
    }
}

SERVICE_STATUS={
    COMMON_EXCEPTION:{
        success:false,
        status:'SERVICE_FFF',
        description:'服务异常'
    },
    SEND_EMAIL_VC_SUCCESS:{
        success:true,
        status:'SERVICE_000',
        description:'邮箱验证码发送成功'
    },
    REGISTER_SUCCESS:{
        success:true,
        status:'SERVICE_001',
        description:'用户注册成功'
    },
    LOGIN_SUCCESS:{
        success:true,
        status:'SERVICE_002',
        description:'用户登录成功'
    },
    MAIL_USED:{
        success:false,
        status:'SERVICE_002',
        description:'用户登录成功'
    },
    SEND_EMAIL_VC_FAIL:{
        success:true,
        status:'SERVICE_003',
        description:'邮箱验证码发送失败'
    },
    REGISTER_FAIL:{
        success:true,
        status:'SERVICE_004',
        description:'用户注册失败'
    },
    LOGIN_FAIL:{
        success:true,
        status:'SERVICE_005',
        description:'用户登录失败'
    },
    LOGOUT_SUCCESS:{
        success:true,
        status:'SERVICE_005',
        description:'用户退出登录成功'
    },
    LOGOUT_FAIL:{
        success:false,
        status:'SERVICE_005',
        description:'用户退出登录失败'
    },
    PARAM_ERROR:{
        success:false,
        status:'SERVICE_006',
        description:'请求参数错误'
    },
    ACCOUNT_LOCKED:{
        success:false,
        status:'SERVICE_007',
        description:'账号被锁定'
    },
    NOT_LOGIN:{
        success:false,
        status:'SERVICE_008',
        description:'用户未登录'
    },
    GET_MEMO_SUCCESS:{
        success:true,
        status:'SERVICE_009',
        description:'便签查询成功'
    },
    MEMO_SET_TOP_SUCCESS:{
        success:true,
        status:'SERVICE_010',
        description:'便签置顶或取消置顶成功'
    },
    MEMO_SET_TOP_FAIL:{
        success:false,
        status:'SERVICE_011',
        description:'便签置顶或取消置顶失败'
    }
}

EVENT_LIST = {
    USER_REGIST:{
        code:'0',
        desc:'用户注册'
    },
    LOGIN_MAIL_PASSWORD:{
        code:'1',
        desc:'邮箱密码登录'
    },
    MEMO_SET_TOP:{
        code:'2',
        desc:'便签置顶'
    },
    MEMO_UNSET_TOP:{
        code:'3',
        desc:'便签取消置顶'
    }
}

module.exports = {REDIS_STATUS,DB_STATUS,SERVICE_STATUS,EVENT_LIST}