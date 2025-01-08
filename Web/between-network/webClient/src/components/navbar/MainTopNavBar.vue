<template>
    <n-space justify="space-between" align="center" style="height: 100%;">
            <a href="/">
                <n-image :src="logoDarkImage"></n-image>
            </a>
        <n-space align="center" :wrap-item="false">
            <!--头像-->
            <n-popover v-model:show = "userMenuShow" trigger="click" width="260px" content-style="padding:10px">
                <template #trigger>
                    <n-button circle :bordered="false">
                        <n-avatar v-if="user_id !== null" round :src="head_image==''?'https://cdn.vuetifyjs.com/images/john.jpg':head_image"/>
                    </n-button>
                </template>
                <n-thing :title="userNickName">
                    <!--头像-->
                    <template #avatar>
                        <n-avatar size="large" round :src="head_image" style="position:relative;top:3px"/>
                    </template>
                    <!--简介-->
                    <template #description>
                        <n-space align="center">
                            <n-tag :bordered="false" :type="userLevel.theme" size="small">{{ userLevel.text }}</n-tag>
                            <n-text depth="3">2099-12-31 到期</n-text>
                        </n-space>
                    </template>
                    <template #default>
                        <n-divider style="margin:5px auto"/>
                        <!--菜单选项-->
                        <n-menu :options="userMenu" :indent="18" :on-update:value="clickUserMenu" />
                    </template>
                </n-thing>
            </n-popover>
            <!--分割线-->
            <n-divider v-if="user_id !== null" vertical />
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
            <n-button v-if="user_id === null" tertiary type="primary" @click="showLoginModal">登录</n-button>
        </n-space>
    </n-space>
</template>

<script setup>
    import {NotificationsNoneOutlined, AccountBoxFilled,ManageAccountsFilled,LogOutRound} from "@vicons/material"
    import { useThemeStore } from "@/stores/themeStore";
    import { useUserStore } from "@/stores/userStore";
    import { useLoginModalStore } from "@/stores/loginModalStore";

    import { h,ref } from "vue";
    import {storeToRefs} from 'pinia'
    import { NIcon } from 'naive-ui'

    import logoDarkImage from '@/assets/img/brand/dark.svg'

    import noteServerRequest  from "@/request";
    import userApi from '@/request/api/userApi';
    import { loginInvalid } from "@/Utils/userLogin";

    //主题信息
    const themeStore = useThemeStore()
    const {theme,isDarkTheme} = storeToRefs(themeStore)
    const {changeTheme} = themeStore

    //改变登录模态框显示状态
    const loginModalStore = useLoginModalStore()
    const {changeLoginModalShow} = loginModalStore
    const {loginModalStep} = storeToRefs(loginModalStore)

    //用户信息
    const userStore = useUserStore()
    const {id:user_id,head_image,userNickName,userLevel} = storeToRefs(userStore)
    
    //是否显示用户菜单
    const userMenuShow = ref(false)

    //读图标
    function renderIcon(icon){
        return ()=>h(NIcon,null,{default:()=>h(icon)})
    }
    //点击头像的菜单
    const userMenu =[
        {
            key:'user-center',
            icon:renderIcon(AccountBoxFilled),
            label:'个人中心'
        },
        {
            key:'account-setting',
            icon:renderIcon(ManageAccountsFilled),
            label:'账号设置'
        },
        {
            key:'sign-out',
            icon:renderIcon(LogOutRound),
            label:'退出登录'
        }
    ]

    //用户菜单选项回调
    const clickUserMenu = (key,value)=>{

        //关闭用户菜单弹出信息
        userMenuShow.value = false

        switch(key){
            case "sign-out":
                signOutLogin();
                break;
            case "user-center":
                //userBasicInfoRef.value.changeActive();
                break;
            case "account-setting":
                break;
        }
    }

    const signOutLogin = async ()=>{
        noteServerRequest(userApi.logout).then(responseData=>{
            if(!responseData) return;
            console.log("sign out login")
            //登录失效处理
            loginInvalid(false)
        })
    }

    const showLoginModal = (e)=>{
        loginModalStep.value = 1
        changeLoginModalShow(true)
    }
    function testFunction(){
        console.log("top bar,user id=>",user_id.value);
    }
    testFunction();
</script>