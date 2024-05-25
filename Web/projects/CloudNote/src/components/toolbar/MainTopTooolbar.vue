<template>
    <n-space justify="space-between" align="center" style="height: 100%;">
        <n-text>之间笔记</n-text>
        <n-space>
            <!--头像-->
            <n-avatar v-if="user_id !== null" round size="small" style="position:relative;top:3px" :src="head_iamge"/>
            <!--分割线-->
            <n-divider v-if="user_id !== null" vertical style="position:relative;top:5px;"/>
            <!--消息-->
            <n-badge dot processing type="success" :offset="[-8,4]">
                <n-button circle tertiary>
                    <n-icon size="18" :component="NotificationsNoneOutlined" />
                </n-button>
            </n-badge>

            <!--主题按钮-->
            <n-button circle tertiary @click="changeTheme(!isDarkTheme)">
                <n-icon size="18" :component="theme.icon" />
            </n-button>
            <!--登录按钮-->
            <n-button v-if="user_id === null" tertiary type="primary" @click="changeLoginModalShow(true)">登录</n-button>
        </n-space>
    </n-space>
</template>

<script setup>
    import {DarkModeRound, NotificationsNoneOutlined, EmailOutlined, LockOpenOutlined} from "@vicons/material"
    import {useThemeStore} from '../../stores/themeStore'
    import {useLoginModalStore} from '../../stores/loginModalStore'
    import { useUserStore } from "../../stores/userStore"
    import {storeToRefs} from 'pinia'

    const themeStore = useThemeStore()
    const {theme,isDarkTheme} = storeToRefs(themeStore)
    const {changeTheme} = themeStore

    const loginModalStore = useLoginModalStore()

    //改变登录模态框显示状态
    const {changeLoginModalShow} = loginModalStore

    const userStore = useUserStore()
    const {id:user_id,head_image} = storeToRefs(userStore)
    
</script>