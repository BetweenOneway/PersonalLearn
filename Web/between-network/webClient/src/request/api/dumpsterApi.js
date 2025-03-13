const fileDumpsterApi = {
    getFileList:{
        name:'获取回收站文件列表',
        url:'/dumpster/getFileList',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    },
    restoreFiles:{
        name:['恢复','批量恢复'],
        url:'/file/restoreFiles',
        method:'POST',
        userPower:true,
        dataParam:false,
        successMessage:true
    },
}

export default fileDumpsterApi