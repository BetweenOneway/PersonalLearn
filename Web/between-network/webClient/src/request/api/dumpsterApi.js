const fileDumpsterApi = {
    getFileList:{
        name:'获取回收站文件列表',
        url:'/dumpster/getFileList',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    }
}

export default fileDumpsterApi