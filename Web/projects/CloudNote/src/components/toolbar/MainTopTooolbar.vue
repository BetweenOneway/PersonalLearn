<template>
    <n-space justify="space-between" align="center" style="height: 100%;">
        <n-text>之间笔记</n-text>
        <n-space>
            <!--头像-->
            <n-avatar round size="small" style="position:relative;top:3px" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"/>
            <!--分割线-->
            <n-divider vertical style="position:relative;top:5px;"/>
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
            <n-button tertiary type="primary" @click="showLoginModal = true">登录</n-button>
        </n-space>
    </n-space>

    <n-modal v-model:show="showLoginModal" transform-origin="center" :close-on-esc="false">
        <div style="width:400px">

            <!---->
            <Login v-if="loginModalStep === 1"/>

            <Register v-else-if="loginModalStep === 2"/>
        </div>
    </n-modal>

</template>
<script setup>
    import {DarkModeRound, NotificationsNoneOutlined, EmailOutlined, LockOpenOutlined} from "@vicons/material"
    import {useThemeStore} from '../../stores/themeStore'
    import {storeToRefs} from 'pinia'
    import {ref} from 'vue'
    import Login from '../login/Login.vue'
    import Register from '../login/Register.vue'

    const themeStore = useThemeStore()
    const {theme,isDarkTheme} = storeToRefs(themeStore)
    const {changeTheme} = themeStore

    const showLoginModal = ref(false)
    //1 登录 2 注册 3 注册成功
    const loginModalStep = ref(2)
</script>