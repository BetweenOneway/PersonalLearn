<template>
    <n-config-provider :theme="theme.name">
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
    import { onMounted, watch } from "vue"
    import {useThemeStore} from './stores/themeStore'
    import useUserStore from './stores/userStore'
    import {storeToRefs} from 'pinia'
    

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
                //将本地存储的主题数据恢复到store中
                themeStore.$hydrate();
                // const newTheme = JSON.parse(event.newValue)
                // changeTheme(newTheme.isDarkTheme)
            }
        })
    })
</script>