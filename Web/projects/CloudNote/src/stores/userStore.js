import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
    "user",
    ()=>{
        //id
        const id=ref(null)
        //昵称
        const nickName = ref('')
        //头像
        const headPic = ref('')
        //等级
        const level = ref(0)
        //邮箱
        const email = ref('')
        //注册时间
        const time=ref('')

        const head_image = computed(()=>{
            if(headPic.value === null)
            {
                return "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            }
            else{
                return headPic.value
            }
        })

        //设置用户信息
        const setUserInfo = (u_id,u_email,u_nickName,u_headPic,u_level,u_time)=>{
            //
            id.value=u_id
            nickName.value = u_nickName
            headPic.value = u_headPic
            level.value=u_level
            email.value=u_email
            time.value=u_time
        }

        return {id,email,nickName,headPic,level,time,setUserInfo,head_image}
    },
    {
        persist: {
            storage:localStorage,//本地存储
        }
    }
)