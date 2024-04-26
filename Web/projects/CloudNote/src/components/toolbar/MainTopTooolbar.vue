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
            <n-button circle tertiary>
                <n-icon size="18" :component="DarkModeRound" />
            </n-button>
            <n-button tertiary type="primary">登录</n-button>
        </n-space>
        
    </n-space>
</template>
<script setup>
    import {DarkModeRound, NotificationsNoneOutlined} from "@vicons/material"
</script>