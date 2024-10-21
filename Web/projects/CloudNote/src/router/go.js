import router from "@/router/index"
import bus from 'vue3-eventbus'

/**
 * 
 * @param {Object | String} path 路径地址 | 路由地址对象
 * @param {*} callback 路由跳转地址后，需要执行的回调函数
 * @param {*} isRouter 是否采用路由
 * @param {*} isNew 是否新标签页（isRouter = false）
 */
export const toHerf = (path='/',callback=()=>{},isRouter=true,isNew)=>{
    if(isRouter)
    {
        //路由跳转
        router.push(path).then(()=>{callback()})
    }
    else{
        //Windows跳转地址
        const target = isNew ? '_blank':'_self';
        window.open(path,target)
    }
}

/**
 * 前往便签页，并打开编辑便签窗口
 * @param {Number} id 便签编号 无值新增 有值编辑
 */
export const showEditMemoWindow = (id)=>{
    toHerf('/memo',()=>{
        bus.emit('showEditMemoModal',id);
    });
}

/**
 * 前往笔记页，并打开新增笔记
 */
export const createNewNote = ()=>{
    toHerf('/note',()=>{
        bus.emits('createNewNote');
    });
}