import router from "@/router/index"

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