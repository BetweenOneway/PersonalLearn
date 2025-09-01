<template>
    <!--布局-->
    <header>
        <div class="nav-bar">
            <MainTopNavBar />
        </div>
    </header>

    <section style="position: relative;">
        <router-view/>
    </section>
    
    <footer></footer>
    <login-modal/>
</template>

<script setup>
    import MainTopNavBar from '@/components/navbar/MainTopNavBar.vue';
    import LoginModal from '@/components/login/LoginModal.vue';

    import {useLoadingBar, useMessage} from 'naive-ui'

    //将消息对象挂在到window
    window.$message = useMessage();
    //将加载条对象挂载到window
    window.$loadingBar = useLoadingBar();

</script>

<style scoped>
    header{
        position:sticky;
        top:0;
        width: 100%;
        height: var(--nav-bar-height);
        display: flex;
        z-index: 100;
    }
    .nav-bar{
        flex:1;
        padding-left: 50px;
        padding-right: 50px;
        background-color: #f3f3f3;
    }
</style>