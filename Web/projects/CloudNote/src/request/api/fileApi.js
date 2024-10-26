const fileApi = {
    delete:{
        name:['删除','彻底删除','批量删除','批量彻底删除'],
        url:'/file/deleteFiles',
        method:'DELETE',
        userPower:true,
        dataParam:false,
        successMessage:true
    },
    getRecentlyUse:
    {
        name:'获取最近使用的文件',
        url:'/recently/getRecentAccessFiles',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    }
}

export default fileApi