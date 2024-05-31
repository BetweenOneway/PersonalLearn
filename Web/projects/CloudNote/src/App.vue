<template>
    <n-config-provider :theme="theme.name">
        <n-loading-bar-provider>
            <n-message-provider>
                <n-layout position="absolute">
                    <!--应用头-->
                    <n-layout-header bordered style="height: 64px;padding:0 20px;">
                        <MainTopToolbar />
                    </n-layout-header>
                    <n-layout position="absolute" has-sider style="top:64px">
                        <!--左侧应用栏-->
                        <n-layout-sider bordered width="64px" content-style="padding: 24px 0; text-align:center;">
                            海淀桥
                        </n-layout-sider>
                        <!--主页面-->
                        <n-layout-content>
                            <router-view/>
                        </n-layout-content>
                    </n-layout>
                </n-layout>
                <login-modal/>
            </n-message-provider>
        </n-loading-bar-provider>
        
    </n-config-provider>
</template>

<script setup>
    import { onMounted } from "vue"
    import MainTopToolbar from "./components/toolbar/MainTopTooolbar.vue"

    import {useThemeStore} from './stores/themeStore'
    import {storeToRefs} from 'pinia'
    import LoginModal from "./components/login/LoginModal.vue"

    const themeStore = useThemeStore()
    const {theme} = storeToRefs(themeStore)
    const {changeTheme} = themeStore

    //监听主题是否发生改变
    onMounted(()=>{
        window.addEventListener('storage',event=>{
            if(event.key ==="theme")
            {
                const newTheme = JSON.parse(event.newValue)
                changeTheme(newTheme.isDarkTheme)
            }
        })
    })
</script>