<template>
    <div>
        <el-container>
            <el-aside width="208px">
                <el-space class="sidebar">
                    <el-space>
                        <el-avatar :icon="UserFilled" />
                    </el-space>
                    <el-space class="userinfo">
                        <el-tag type="primary">VIP 1</el-tag>
                    </el-space>
                    <el-space direction="vertical" class="expand-layout">
                        <div class="sidebar-operate">
                            <el-button type="primary" size="large">新建</el-button>
                        </div>
                        <div class="sidebar-content">
                            <el-scrollbar height="400px">
                                <el-menu
                                default-active="1"
                                @open="handleOpen"
                                @close="handleClose"
                                >
                                    <el-sub-menu index="1">
                                        <template #title>
                                            <el-icon><location /></el-icon>
                                            <span>我的笔记</span>
                                        </template>
                                        <el-menu-item-group title="Group One">
                                            <el-menu-item index="1-1">item one</el-menu-item>
                                            <el-menu-item index="1-2">item two</el-menu-item>
                                        </el-menu-item-group>
                                        <el-menu-item-group title="Group Two">
                                            <el-menu-item index="1-3">item three</el-menu-item>
                                        </el-menu-item-group>
                                        <el-sub-menu index="1-4">
                                            <template #title>item four</template>
                                            <el-menu-item index="1-4-1">item one</el-menu-item>
                                        </el-sub-menu>
                                    </el-sub-menu>
                                    <el-menu-item index="2">
                                        <el-icon><icon-menu /></el-icon>
                                        <span>Navigator Two</span>
                                    </el-menu-item>
                                    <el-menu-item index="3" disabled>
                                        <el-icon><document /></el-icon>
                                        <span>Navigator Three</span>
                                    </el-menu-item>
                                    <el-menu-item index="4">
                                        <el-icon><setting /></el-icon>
                                        <span>Navigator Four</span>
                                    </el-menu-item>
                                </el-menu>
                            </el-scrollbar>
                        </div>
                        <div class="sidebar-footer"></div>
                    </el-space>
                </el-space>
            </el-aside>
            <el-container>
                <el-aside width="312px">笔记本内容区域</el-aside>
                <el-container>
                    <el-header>标题栏</el-header>
                    <el-main>编辑器区域</el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
    import { UserFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
@import url('@/assets/reset.css');
@import url('@/assets/main.css');
.sidebar{
    padding-top: 32px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    box-sizing: border-box;
}
.sidebar-operate{
    padding: 10px 0;
    height: 40px;
}
.sidebar-content{
    margin-top: 12px;
    padding-bottom: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}
.userinfo {
    margin:16px auto 0;
}

.expand-layout{
    min-height: 360px;
    box-sizing: border-box;
}
</style>