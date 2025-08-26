<template>
    <div style="height: 100vh; position: relative">
        <n-layout>
            <n-layout-header style="height: 64px; padding: 24px" bordered>
                颐和园路
            </n-layout-header>
            <n-layout-content>
                <div style="position: absolute;top: 64px;z-index: 100;">
                    <n-layout has-sider>
                        <n-layout-sider bordered content-style="padding: 24px;">
                            海淀桥
                        </n-layout-sider>
                        <n-layout content-style="padding: 24px;">
                            <n-h2 v-for="i in 50">平山道</n-h2>
                        </n-layout>
                    </n-layout>
                </div>
            </n-layout-content>
            <n-layout-footer
            bordered
            style="height: 64px; padding: 24px"
            >
            城府路
            </n-layout-footer>
        </n-layout>
    </div>
</template>