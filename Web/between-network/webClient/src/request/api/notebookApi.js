const notebookApi = {
    getNotebookList:{
        name:'获取笔记本列表',
        url:'/notebook/getUserNotebookList',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    },
    addNotebook:{
        name:'新增笔记本',
        url:'/notebook/addNotebook',
        method:'POST',
        userPower:true,
        dataParam:true,
        successMessage:true
    },
    renameNotebook:{
        name:'笔记本重命名',
        url:'/notebook/renameNotebook',
        method:'POST',
        userPower:true,
        dataParam:true,
        successMessage:true
    },
    deleteNotebook:{
        name:['删除笔记本','彻底删除笔记本'],
        url:'/note/deleteNotebook',
        method:'DELETE',
        userPower:true,
        dataParam:false,
        successMessage:true
    },
}

export default notebookApi