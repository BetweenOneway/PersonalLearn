const memoApi = {
    getMemoList:{
        name:'获取便签列表',
        url:'/memo/getUserMemoList',
        method:'GET',
        userAuth:true,
        dataParam:false,
        successMessage:false
    },
    topMemo:{
        name:['置顶便签','取消置顶便签'],
        url:'/memo/setMemoTop',
        method:'GET',
        userAuth:true,
        dataParam:false,
        successMessage:true
    },
    deleteMemo:{
        name:['删除便签','彻底删除便签'],
        url:'/memo/deleteMemo',
        method:'DELETE',
        userAuth:true,
        dataParam:false,
        successMessage:true
    },
    saveMemo:{
        name:['保存便签','新增便签'],
        url:['/memo/updateMemo','/memo/addMemo'],
        method:['POST','PUT'],
        userAuth:true,
        dataParam:false,
        successMessage:true
    },
    getMemoInfo:{
        name:'获取便签信息',
        url:'memo/getMemoInfo',
        method:'GET',
        userAuth:true,
        dataParam:false,
        successMessage:false
    }
}

export default memoApi