<template>
    <div class="common-layout">
      <el-container style="height: 100vh;">
        <el-header>Header</el-header>
        <el-container>
            <el-aside width="250px">
                <el-space direction="vertical">
                    <div class="block">
                        <el-menu>
                            <el-sub-menu index="1">
                                <template #title>
                                    <el-icon><location /></el-icon>
                                    <span>Navigator One</span>
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
                    </div>
                    <div class="block">2</div>
                </el-space>
            </el-aside>
            <el-container>
                <el-main>Main</el-main>
                <el-footer>Footer</el-footer>
            </el-container>
            </el-container>
      </el-container>
    </div>
</template>
  

<script setup></script>

<style scoped>
@import url('@/assets/test.css');
.block{
    min-width: 100px;
    min-height: 100px;
    box-sizing:border-box;
    border: 1px solid red;
}

</style>