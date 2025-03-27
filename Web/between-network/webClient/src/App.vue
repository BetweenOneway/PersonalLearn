<template>
    <n-config-provider :theme="theme.name" :locale="zhCN" :date-locale="dateZhCN">
        <n-loading-bar-provider>
            <n-notification-provider>
                <n-dialog-provider>
                    <n-message-provider>
                        <RootView />
                    </n-message-provider>
                </n-dialog-provider>
            </n-notification-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>

<script setup>
    import RootView from '@/views/RootView.vue'
    import { onMounted, watch, ref,provide, onBeforeUnmount} from "vue"
    import {useThemeStore} from './stores/themeStore'
    import {useUserStore} from './stores/userStore'
    import {storeToRefs} from 'pinia'
    import {useRouter} from 'vue-router'

    import noteServerRequest from "@/request"
    import userApi from "@/request/api/userApi"

    const themeStore = useThemeStore()
    const {theme} = storeToRefs(themeStore)
    //const {changeTheme} = themeStore

    import { zhCN, dateZhCN } from 'naive-ui'

    //用户的共享资源
    const userStore = useUserStore();
    const {setUserInfo,resetUserInfo} = useUserStore()
    const {token:userToken} = storeToRefs(userStore);

    //路由对象
    const router = useRouter()

    const routerPath = ref(router.currentRoute.value.path);
    //监控路由地址变化
    watch(
        ()=>router.currentRoute.value,
        newData=>{
            routerPath.value = newData.path;
        }
    );

    //
    onBeforeUnmount(()=>{
        resetUserInfo();
    })

    //为后代提供路由地址数据
    provide('routerPath',routerPath);

    //如果用户的登陆状态发生改变，重新加载页面
    //是否需要重新加载页面
    const needReload = ref(false)

    //为后代组件提供数据
    provide('needReload',needReload);
    
    //初始化
    async function Init()
    {
        console.log("usertoken=>",userToken);
        if(!!userToken.value)
        {
            //获取请求API
            let API = {...userApi.getUserInfo}
            //发送请求
            await noteServerRequest(API).then(responseData =>{
                if(!responseData)
                {
                    console.log("获取用户信息失败，清空本地存储");
                    resetUserInfo();
                    return;
                }
                console.log("responseData=>",responseData)
                setUserInfo(responseData.userToken,responseData.userInfo)
            })
        }
        else
        {
            console.log("本地未保存token，清空用户信息")
            resetUserInfo();
        }
    }
    //监听主题是否发生改变
    onMounted(()=>{
        window.addEventListener('storage',event=>{
            if(event.key ==="theme")
            {
                //将本地存储的主题数据恢复到store中
                themeStore.$hydrate();
                // const newTheme = JSON.parse(event.newValue)
                // changeTheme(newTheme.isDarkTheme)
            }
            else if(event.key === 'user')
            {
                //仅当token发生变化才重新加载页面
                const newToken = JSON.parse(event.newValue)?.token;
                const oldToken = JSON.parse(event.oldValue)?.token;
                if(newToken === oldToken)
                {
                    //将本地存储的用户数据恢复到store中
                    userStore.$hydrate();
                }
                else
                {
                    needReload.value = true;
                    setTimeout(() => {
                        needReload.value = false;
                    }, 1000);
                }
            }
        });
        Init();
    })
</script>