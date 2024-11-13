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
        //性别 0 女 1 男
        const sex = ref(null)
        //出生日期
        const birthday = ref(null)

        const head_image = computed(()=>{
            console.log("get user headPic:",headPic.value);
            if(!headPic.value)
            {
                return "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            }
            else{
                return headPic.value
            }
        })

        const userNickName = computed(()=>{
            console.log("get user nickname:",nickName.value);
            if(!nickName.value)
            {
                return "暂未设置名称"
            }
            else{
                return nickName.value
            }
        })

        const userLevel = computed(()=>{
            return !!level.value ? 
                {
                    theme:"warning",
                    text:"超级会员"
                }:
                {
                    theme:"default",
                    text:"会员"
                };
        })

        /**
         * 设置用户信息
         * @param {string} userToken 登陆的token值
         * @param {Object} user 
         */
        const setUserInfo = (userToken,user)=>{
            //
            token.value = userToken;
            setUserBasicInfo(user);
        }

        /**
         * 设置用户信息
         * @param {Object} user 
         */
        const setUserBasicInfo = (user)=>{
            id.value=user.id
            nickName.value = user.nickName
            headPic.value = user.headPic
            level.value=user.level
            email.value=user.email
            time.value=user.time
            sex.value=user.sex;
            birthday.value = user.birthday;
        }

        //重置用户信息
        const resetUserInfo = ()=>{
            token.value = null;
            const userToken = localStorage.getItem("userToken")
            //userToken本地存储删除
            localStorage.removeItem(userToken)
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
                sex.value = null
                birthday.value = null
            }
        })

        return {token,id,email,nickName,userNickName,headPic,userLevel,time,sex,birthday,
            setUserInfo,setUserBasicInfo,resetUserInfo,head_image}
    },
    {
        persist: {
            storage:localStorage,//本地存储
        }
    }
)
