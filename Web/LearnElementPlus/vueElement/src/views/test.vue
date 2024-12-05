<template>
    <el-container class="home_container">
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu active-text-color="#409Eff"
            background-color="#545c64"
            text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false">
            <!-- 一级菜单 -->
            <el-sub-menu index="1">
                <template #title>
                    <el-icon><location /></el-icon>
                    <span>Navigator One</span>
                </template>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
                <el-menu-item index="1-3">item three</el-menu-item>
                <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu :index="item.id+''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单模板区域 -->
                <template #title>
                    <el-icon><location /></el-icon>
                    <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="subItem.id" v-for="subItem in item.children" :key="subItem.id">
                    <template #title>
                        <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';

let menulist=ref([]);
menulist.value.push({
    id:0,
    authName:'用户管理',
    children:[
        {id:'0-1',authName:'test1'},
        {id:'0-2',authName:'test2'}
    ]
})
menulist.value.push({
    id:1,
    authName:'权限管理',
    children:[
        {id:'1-1',authName:'test1'},
        {id:'1-2',authName:'test2'}
    ]
})
menulist.value.push({
    id:2,
    authName:'商品管理',
    children:[
        {id:'2-1',authName:'test1'},
        {id:'2-2',authName:'test2'}
    ]
})
menulist.value.push({
    id:3,
    authName:'订单管理',
    children:[
        {id:'3-1',authName:'test1'},
        {id:'3-2',authName:'test2'}
    ]
})
menulist.value.push({
    id:4,
    authName:'数据统计',
    children:[
        {id:'4-1',authName:'test1'},
        {id:'4-2',authName:'test2'}
    ]
})

let isCollapse = ref(false);
function toggleCollapse () {
      isCollapse.value = !isCollapse.value
    }

</script>

<style scoped>

.el-aside {
  background-color: #313743;
}
.el-aside .el-menu{
    border-right: none;
}
.el-main {
  background-color: #e9edf1;
}

.toggle-button{
/*添加背景颜色*/
background-color: #4A5064;
 /*设置文本大小*/
 font-size:10px;
 /*设置文本行高*/
 line-height:24px;
 /* 设置文本颜色*/
 color:#fff;
 /* 设置文本居中*/
 text-align: center;
 /*设置文本间距*/
 letter-spacing: 0.2em;
 /*设置鼠标悬浮变小手效果*/
 cursor:pointer;
}
</style>