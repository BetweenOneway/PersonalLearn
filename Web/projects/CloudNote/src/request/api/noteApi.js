const noteApi = {
    getNoteList:{
        name:'获取笔记列表',
        url:'/note/getUserNoteList',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:false
    },
    topNote:{
        name:['置顶笔记','取消置顶笔记'],
        url:'/note/setNoteTop',
        method:'GET',
        userPower:true,
        dataParam:false,
        successMessage:true
    },
    deleteNote:{
        name:['删除笔记','彻底删除笔记'],
        url:'/note/deleteNote',
        method:'DELETE',
        userPower:true,
        dataParam:false,
        successMessage:true
    }
}

export default noteApi