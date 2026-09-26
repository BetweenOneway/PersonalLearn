<template>
    <div class="top-nav-root">
    <n-space justify="space-between" align="center" style="height: 100%;">
        <a href="/">
            <n-image :src="logoDarkImage"></n-image>
        </a>
        <!--中部导航-->
        <n-space align="center" :wrap-item="false" :size="28">
            <n-button
                text
                class="nav-center-item"
                :type="activeNav === 'home' ? 'primary' : 'default'"
                @mouseenter="hideCoBuildPanel"
                @click="toNavRoute('/')"
            >首页</n-button>
            <n-button
                text
                class="nav-center-item"
                :class="{ 'nav-center-dropdown--open': coBuildPanelShow }"
                :type="coBuildActive || coBuildPanelShow ? 'primary' : 'default'"
                @mouseenter="showCoBuildPanel"
                @mouseleave="delayHideCoBuildPanel"
                @click="toNavRoute('/feedback')"
            >
                共享共建
                <n-icon size="16" :component="KeyboardArrowDownRound" class="nav-caret" />
            </n-button>
        </n-space>

        <n-space align="center" :wrap-item="false">
            <!--头像-->
            <n-popover v-model:show = "userMenuShow" trigger="click" width="260px" content-style="padding:10px">
                <template #trigger>
                    <n-button circle :bordered="false">
                        <n-avatar v-if="user_id !== null" round :src="head_image"/>
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

            <!--登录按钮-->
            <n-button v-if="user_id === null" tertiary type="primary" @click="showLoginModal">登录</n-button>
            <!--注册按钮-->
            <n-button v-if="user_id === null" tertiary type="primary" @click="showRegisterModal">注册</n-button>
            
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
            
        </n-space>
    </n-space>

    <!--共享共建下拉面板：铺满顶栏宽度-->
    <transition name="mega-fade">
        <div
            v-show="coBuildPanelShow"
            class="mega-panel"
            :class="{ 'mega-panel--dark': isDarkTheme }"
            @mouseenter="showCoBuildPanel"
            @mouseleave="delayHideCoBuildPanel"
        >
            <div class="mega-panel-inner">
                <div class="mega-item" @click="toNavRoute('/devlog')">
                    <div class="mega-item-title">开发日志</div>
                    <n-text depth="3" class="mega-item-desc">记录每一次版本迭代与功能更新</n-text>
                    <span class="mega-item-go">前往查看 →</span>
                </div>
                <div class="mega-item" @click="toNavRoute('/feedback')">
                    <div class="mega-item-title">用户反馈</div>
                    <n-text depth="3" class="mega-item-desc">提交你的需求与遇到的问题</n-text>
                    <span class="mega-item-go">立即反馈 →</span>
                </div>
            </div>
        </div>
    </transition>
    </div>
</template>

<script setup>
    import {NotificationsNoneOutlined, AccountBoxFilled,LogOutRound,KeyboardArrowDownRound} from "@vicons/material"
    import { useThemeStore } from "@/stores/themeStore";
    import { useUserStore } from "@/stores/userStore";
    import { useLoginModalStore } from "@/stores/loginModalStore";

    import { h,ref,computed,onBeforeUnmount } from "vue";
    import {storeToRefs} from 'pinia'
    import { NIcon } from 'naive-ui'
    import { useRoute } from 'vue-router'

    import logoDarkImage from '@/assets/img/brand/dark.svg'

    import noteServerRequest  from "@/request";
    import userApi from '@/request/api/userApi';
    import { loginInvalid } from "@/Utils/userLogin";

    import { toHerf } from "@/router/go";

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

    //当前路由地址
    const route = useRoute()

    //中部导航当前选中项
    const activeNav = computed(()=>{
        if(route.path.startsWith('/feedback')) return 'feedback'
        if(route.path.startsWith('/devlog')) return 'devlog'
        if(route.path === '/') return 'home'
        return ''
    })

    //共享共建下拉菜单是否处于选中态（开发日志/用户反馈都算）
    const coBuildActive = computed(()=> activeNav.value === 'feedback' || activeNav.value === 'devlog')

    //点击中部导航跳转
    const toNavRoute = (path)=>{
        hideCoBuildPanel();
        //已经在当前页面则不再重复跳转
        if(route.path === path) return
        toHerf(path)
    }

    //共享共建下拉面板显示状态
    const coBuildPanelShow = ref(false)
    let coBuildHideTimer = null

    const showCoBuildPanel = ()=>{
        clearTimeout(coBuildHideTimer)
        coBuildPanelShow.value = true
    }

    //延迟收起，给鼠标从按钮移动到面板留时间
    const delayHideCoBuildPanel = ()=>{
        clearTimeout(coBuildHideTimer)
        coBuildHideTimer = setTimeout(()=>{
            coBuildPanelShow.value = false
        }, 200)
    }

    const hideCoBuildPanel = ()=>{
        clearTimeout(coBuildHideTimer)
        coBuildPanelShow.value = false
    }

    onBeforeUnmount(()=>{
        clearTimeout(coBuildHideTimer)
    })

    //是否显示用户菜单
    const userMenuShow = ref(false)

    //读图标
    function renderIcon(icon){
        return ()=>h(NIcon,null,{default:()=>h(icon)})
    }
    //点击头像的菜单
    const userMenu =[
        {
            key:'info-manage',
            icon:renderIcon(AccountBoxFilled),
            label:'信息管理'
        },
        {
            key:'my-zone',
            icon:renderIcon(AccountBoxFilled),
            label:'我的空间'
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
            case 'info-manage':
                toHerf('/admin')
                break;
            case 'my-zone':
                toHerf(`/zone/${user_id.value}`)
                break;
        }
    }

    //退出登录
    const signOutLogin = async ()=>{
        noteServerRequest(userApi.logout).then(responseData=>{
            if(!responseData) return;
            console.log("sign out login")
            //登录失效处理
            loginInvalid(false);
            //回到主页
            toHerf();
        })
    }

    const showLoginModal = (e)=>{
        loginModalStep.value = 1
        changeLoginModalShow(true)
    }
    const showRegisterModal = (e)=>{
        loginModalStep.value = 2
        changeLoginModalShow(true)
    }
    function testFunction(){
        console.log("top bar,user id=>",user_id.value);
    }
    testFunction();
</script>

<style scoped>
    /*撑满顶栏高度；不设 position，让下拉面板继续锚定到全宽的 .nav-header*/
    .top-nav-root {
        height: 100%;
    }

    .nav-center-item {
        --n-font-size: 16px;
        --n-height: 36px;
        font-size: 16px;
        font-weight: 500;
    }

    .nav-caret {
        margin-left: 2px;
        vertical-align: -2px;
        transition: transform 0.2s;
    }

    .nav-center-dropdown--open .nav-caret {
        transform: rotate(180deg);
    }

    /*共享共建下拉面板：锚定到 position:fixed 的顶栏，铺满整行*/
    .mega-panel {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 99;
        background-color: #ffffff;
        border-bottom: 1px solid #e8e8e8;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
    }

    .mega-panel--dark {
        background-color: #101014;
        border-bottom-color: #ffffff1a;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
    }

    .mega-panel-inner {
        max-width: 1140px;
        margin: 0 auto;
        padding: 24px 15px 28px;
        display: flex;
        gap: 24px;
    }

    .mega-item {
        flex: 1;
        max-width: 360px;
        padding: 14px 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .mega-item:hover {
        background-color: #f5f6f7;
    }

    .mega-panel--dark .mega-item:hover {
        background-color: #ffffff14;
    }

    .mega-item-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
        transition: color 0.2s;
    }

    .mega-item:hover .mega-item-title {
        color: #18a058;
    }

    .mega-item-desc {
        display: block;
        font-size: 13px;
        margin-bottom: 10px;
    }

    .mega-item-go {
        font-size: 13px;
        color: #18a058;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .mega-item:hover .mega-item-go {
        opacity: 1;
    }

    .mega-fade-enter-active,
    .mega-fade-leave-active {
        transition: opacity 0.18s ease, transform 0.18s ease;
    }

    .mega-fade-enter-from,
    .mega-fade-leave-to {
        opacity: 0;
        transform: translateY(-6px);
    }
</style>