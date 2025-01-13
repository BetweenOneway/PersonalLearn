const notebookApi = {
    getNotebookList:{
        name:'获取笔记本列表',
        url:'/notebook/getUserNotebookList',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    },
    createNote:{
        name:'创建笔记',
        url:'/notebook/addNewNotebook',
        method:'POST',
        userPower:true,
        dataParam:false,
        successMessage:true
    },
}

export default notebookApi