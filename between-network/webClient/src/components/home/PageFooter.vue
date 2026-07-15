<template>
    <footer :class="['page-footer', { 'page-footer--dark': isDarkTheme }]">
        <div class="footer-main">
            <div class="footer-main__inner">
                <!-- 产品 -->
                <div class="footer-col">
                    <h4 class="footer-col__title">产品</h4>
                    <ul class="footer-col__list">
                        <li><a href="/note" @click.prevent="goRoute('/note')">云笔记</a></li>
                        <li><a href="/blog">博客</a></li>
                        <li><a href="javascript:void(0)">Markdown 编辑器</a></li>
                        <li><a href="javascript:void(0)">多端同步</a></li>
                    </ul>
                </div>
                <!-- 关于 -->
                <div class="footer-col">
                    <h4 class="footer-col__title">关于</h4>
                    <ul class="footer-col__list">
                        <li><a href="javascript:void(0)">关于我们</a></li>
                        <li><a href="javascript:void(0)">用户协议</a></li>
                        <li><a href="javascript:void(0)">隐私政策</a></li>
                        <li><a href="javascript:void(0)">帮助中心</a></li>
                    </ul>
                </div>
                <!-- 联系方式 -->
                <div class="footer-col">
                    <h4 class="footer-col__title">联系方式</h4>
                    <ul class="footer-col__list">
                        <li><a href="javascript:void(0)">邮箱：support@between.net.cn</a></li>
                        <li><a href="javascript:void(0)">GitHub</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-copyright">
            <span>Copyright © {{ currentYear }} 之间网络 All Rights Reserved.</span>
        </div>
    </footer>
</template>

<script setup>
    import { toHerf } from '@/router/go';
    import { useThemeStore } from "@/stores/themeStore";
    import { storeToRefs } from 'pinia';

    const themeStore = useThemeStore();
    const { isDarkTheme } = storeToRefs(themeStore);

    const currentYear = new Date().getFullYear();

    function goRoute(path) {
        toHerf(path);
    }
</script>

<style scoped>
    .page-footer {
        background-color: #f5f6f7;
        color: #333;
        border-top: 1px solid #e8e8e8;
    }

    .page-footer--dark {
        background-color: #101014;
        color: #fff;
        border-top-color: #ffffff1a;
    }

    .footer-main {
        padding: 50px 0 40px;
    }

    .footer-main__inner {
        max-width: 1140px;
        margin: 0 auto;
        padding: 0 15px;
        display: flex;
        gap: 40px;
    }

    @media (max-width: 767px) {
        .footer-main__inner {
            flex-wrap: wrap;
            gap: 30px;
        }
    }

    .footer-col {
        flex: 1;
        min-width: 160px;
    }

    .footer-col__title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #333;
    }

    .page-footer--dark .footer-col__title {
        color: #fff;
    }

    .footer-col__list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-col__list li {
        margin-bottom: 10px;
    }

    .footer-col__list li a {
        color: #666;
        font-size: 14px;
        text-decoration: none;
        transition: color 0.2s, padding-left 0.2s;
        display: inline-block;
    }

    .page-footer--dark .footer-col__list li a {
        color: #999ec4;
    }

    .footer-col__list li a:hover {
        color: #2080f0;
        padding-left: 6px;
    }

    .page-footer--dark .footer-col__list li a:hover {
        color: #ea5822;
    }

    .footer-copyright {
        background-color: #e8e8e8;
        text-align: center;
        padding: 16px 15px;
        font-size: 13px;
        color: #999;
    }

    .page-footer--dark .footer-copyright {
        background-color: #0a0a0e;
        color: #94a7b5;
    }
</style>
