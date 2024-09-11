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
    }
}

export default noteApi