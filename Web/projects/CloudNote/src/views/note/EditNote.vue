<template>

</template>

<script setup>
    import { getUserToken,loginInvalid } from "../../Utils/userLogin";
    import { noteBaseRequest } from "../../request/noteRequest";
    import {useMessage,useLoadingBar} from 'naive-ui'

    //消息对象
    const message = useMessage()
    const loadingBar = useLoadingBar()

    const propsData = defineProps({
        id:{type:Number,required:true}
    })

    /**
     * 获取编辑笔记信息
     */
     const getNoteInfo = async ()=>{
        //判断用户登录状态
        const userToken = await getUserToken()

        //头部加载进度条开始
        loadingBar.start()

        const {data:responseData} = await noteBaseRequest.get(
                "/note/getNoteInfo",
                {
                    params:{
                        userToken:userToken,
                        noteId:propsData.id
                    }
                }
            ).catch(()=>{
                //加载条异常结束
                loadingBar.error()
                //显示失败的通知
                throw message.error("获取笔记信息失败")
            }
        )

        if(responseData.success)
        {
            loadingBar.finish();
            console.log(responseData.data)
        }
        else
        {
            loadingBar.error()
            message.error(responseData.description)
            //登录失效处理
            if(responseData.status ==='SERVICE_008')
            {
                loginInvalid(true)
            }
        }
    }

    //如果笔记编号发生改变 重新获取指定笔记信息
    watch(
        ()=>propsData.id,
        ()=>{
            getNoteInfo();
        }
    )
    //获取选定笔记信息
    getNoteInfo();
</script>