const notebookApi = {
    getNoteList:{
        name:'获取笔记本列表',
        url:'/notebook/getUserNotebookList',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    },
}

export default notebookApi