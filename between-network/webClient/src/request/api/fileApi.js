const fileApi = {
    deleteFile:{
        name:['删除','彻底删除','批量删除','批量彻底删除'],
        url:'/file/deleteFiles',
        method:'DELETE',
        userAuth:true,
        dataParam:false,
        successMessage:true
    },
    getRecentlyUse:
    {
        name:'获取最近使用的文件',
        url:'/recently/getRecentAccessFiles',
        method:'GET',
        userAuth:true,
        dataParam:false,
        successMessage:false
    }
}

export default fileApi