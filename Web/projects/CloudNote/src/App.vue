<template>
    <n-config-provider :theme="theme.name">
        <n-loading-bar-provider>
            <n-notification-provider>
                <n-message-provider>
                    <n-layout position="absolute">
                        <!--应用头-->
                        <n-layout-header bordered style="height: 64px;padding:0 20px;">
                            <MainTopToolbar />
                        </n-layout-header>
                        <n-layout position="absolute" has-sider style="top:64px">
                            <!--左侧应用栏-->
                            <n-layout-sider bordered width="64px" content-style="padding: 24px 0; text-align:center;">
                                <MainLeftToolBar />
                            </n-layout-sider>
                            <!--主页面-->
                            <router-view/>
                        </n-layout>
                    </n-layout>
                    <login-modal/>
                </n-message-provider>
            </n-notification-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>

<script setup>
    import { onMounted, watch } from "vue"
    import MainTopToolbar from "./components/toolbar/MainTopTooolbar.vue"
    import MainLeftToolBar from "./components/toolbar/MainLeftToolBar.vue"

    import {useThemeStore} from './stores/themeStore'
    import useUserStore from './stores/userStore'
    import {storeToRefs} from 'pinia'
    import LoginModal from "./components/login/LoginModal.vue"

    const themeStore = useThemeStore()
    const {theme} = storeToRefs(themeStore)
    const {changeTheme} = themeStore

    //用户的共享资源
    const userStore = useUserStore();
    const {token} = storeToRefs(userStore)

    //如果用户的登陆状态发生改变，重新加载页面
    watch(()=>token.value,newData =>{
        if(newData !== null)
        {
            location.reload();
        }
    })

    //监听主题是否发生改变
    onMounted(()=>{
        window.addEventListener('storage',event=>{
            if(event.key ==="theme")
            {
                const newTheme = JSON.parse(event.newValue)
                changeTheme(newTheme.isDarkTheme)
            }
            else if(event.key === 'user')
            {
                console.log('用户登陆状态发生改变')
                //用户登陆状态发生改变 重新刷新页面
                location.reload();
            }
        })
    })
</script>