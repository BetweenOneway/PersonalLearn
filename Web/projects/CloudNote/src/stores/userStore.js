import { defineStore } from 'pinia'
import { computed, ref,watch } from 'vue'

export const useUserStore = defineStore(
    "user",
    ()=>{
        //用户登陆的token值
        const token=ref(null)
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

        const userNickName = computed(()=>{
            if(nickName.value === null)
            {
                return "暂未设置名称"
            }
            else{
                return nickName.value
            }
        })

        const userLevel = computed(()=>{
            if(level.value == 0)
            {
                return "会员"
            }
            else{
                return "超级会员"
            }
        })

        /**
         * 设置用户信息
         * @param {string} u_token 登陆的token值
         * @param {*} u_id 
         * @param {*} u_email 
         * @param {*} u_nickName 
         * @param {*} u_headPic 
         * @param {*} u_level 
         * @param {*} u_time 
         */
        const setUserInfo = (u_token,u_id,u_email,u_nickName,u_headPic,u_level,u_time)=>{
            //
            token.value = u_token;
            id.value=u_id
            nickName.value = u_nickName
            headPic.value = u_headPic
            level.value=u_level
            email.value=u_email
            time.value=u_time
        }

        //重置用户信息
        const resetUserInfo = ()=>{
            token.value = null;
        }

        watch(()=>token.value,newData=>{
            if(newData === null)
            {
                id.value=null
                nickName.value = null
                headPic.value = null
                level.value=null
                email.value=null
                time.value=null
            }
        })

        return {token,id,email,userNickName,headPic,userLevel,time,setUserInfo,resetUserInfo,head_image}
    },
    {
        persist: {
            storage:localStorage,//本地存储
        }
    }
)
