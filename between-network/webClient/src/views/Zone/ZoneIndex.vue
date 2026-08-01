<template>
    <div class="zone-page">
        <!-- 顶部背景横幅（QQ空间风格） -->
        <div class="zone-banner">
            <div class="weather-widget">
                <div class="weather-main">
                    <n-icon :size="32" :component="NightsStayOutlined" color="#f0c040" />
                    <span class="weather-temp">29°</span>
                </div>
                <div class="weather-info">
                    <span class="weather-city">上海</span>
                    <span class="weather-date">8月1日</span>
                </div>
            </div>

            <div class="banner-content">
                <div class="banner-left">
                    <n-image class="banner-avatar" preview-disabled :src="userInfo.avatar" />
                    <div class="banner-user">
                        <div class="nickname-row">
                            <h2 class="nickname">{{ userInfo.nickname }}</h2>
                        </div>
                        <p class="user-motto">{{ userInfo.bio || '暂无个性签名' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 主体内容 -->
        <div class="zone-container">
            <!-- 左侧边栏 -->
            <div class="zone-sidebar">
                <n-card class="zone-card" title="个人成就">
                    <n-space vertical :size="12">
                        <div class="achievement-item">
                            <n-icon :size="18" :component="EmojiEventsOutlined" color="#f0a020" />
                            <span>优质创作者</span>
                        </div>
                        <div class="achievement-item">
                            <n-icon :size="18" :component="VerifiedOutlined" color="#2080f0" />
                            <span>领域专家</span>
                        </div>
                        <div class="achievement-item">
                            <n-icon :size="18" :component="FavoriteBorderOutlined" color="#d03050" />
                            <span>获得 {{ userInfo.likes }} 次点赞</span>
                        </div>
                        <div class="achievement-item">
                            <n-icon :size="18" :component="StarBorderOutlined" color="#f0a020" />
                            <span>获得 {{ userInfo.collects }} 次收藏</span>
                        </div>
                    </n-space>
                </n-card>

                <n-card class="zone-card" title="原力等级">
                    <n-space vertical :size="8">
                        <div class="force-row">
                            <span class="force-label">原力等级</span>
                            <span class="force-value">{{ userInfo.forceLevel }}</span>
                        </div>
                        <div class="force-row">
                            <span class="force-label">原力分</span>
                            <span class="force-value">{{ userInfo.forceScore }}</span>
                        </div>
                        <div class="force-row">
                            <span class="force-label">本月获得</span>
                            <span class="force-value">{{ userInfo.forceMonth }}</span>
                        </div>
                    </n-space>
                </n-card>
            </div>

            <!-- 右侧主内容 -->
            <div class="zone-main">
                <n-card class="zone-card">
                    <n-tabs v-model:value="activeTab" type="line" animated>
                        <n-tab-pane name="article" tab="文章">
                            <n-empty description="暂无文章" />
                        </n-tab-pane>
                        <n-tab-pane name="column" tab="说说">
                            <n-empty description="暂未说说" />
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import {
        EmojiEventsOutlined,
        VerifiedOutlined,
        FavoriteBorderOutlined,
        StarBorderOutlined,
        WorkspacePremiumOutlined,
        NightsStayOutlined
    } from '@vicons/material';

    const props = defineProps({
        id: {
            type: [String, Number],
            default: ''
        },
        author: {
            type: Object,
            default: null
        }
    });

    const activeTab = ref('article');

    // 当前访问的作者 id，来自路由 /zone/:id，由博客详情页"查看TA的空间"带入
    const authorId = ref(props.id);

    // 作者信息由传入的整个 authorInfo 对象初始化，后续接入真实接口时可在 loadAuthor 中覆盖
    const userInfo = ref({
        nickname: props.author?.nickName || 'Seal^A',
        avatar: props.author?.headPic || 'https://cdn.vuetifyjs.com/images/john.jpg',
        location: '贵州省',
        joinDate: '2018-03-14',
        bio: '涉浅水者得鱼虾，入深水者得蛟龙。',
        visits: '21,179,808',
        rank: '59',
        fans: '60,250',
        follows: '1,973',
        likes: '65,285',
        collects: '220,065',
        forceLevel: 9,
        forceScore: 27779,
        forceMonth: 1228
    });

    // 预留：根据 authorId 获取作者信息，后续接入真实接口时在此替换 userInfo
    async function loadAuthor() {
        if (!authorId.value) return;
        // TODO: 调用接口获取作者信息并赋值给 userInfo
    }

    onMounted(() => {
        loadAuthor();
    });

    const recentList = ref([]);
</script>

<style scoped>
.zone-page {
    min-height: calc(100vh - var(--nav-bar-height));
    background-color: #f5f6f7;
}

/* 顶部横幅 */
.zone-banner {
    position: relative;
    width: 100%;
    height: 220px;
    background: linear-gradient(180deg, #dff0fe 0%, #b8daff 60%, #9acafc 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 28px;
    overflow: hidden;
}

/* 天空装饰：底部云朵曲线 */
.zone-banner::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 90px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath fill='%23f5f6f7' d='M0,64 C240,120 480,20 720,64 C960,108 1200,40 1440,80 L1440,120 L0,120 Z'/%3E%3C/svg%3E") no-repeat bottom center;
    background-size: cover;
    pointer-events: none;
    z-index: 1;
}

/* 天气小组件 */
.weather-widget {
    position: relative;
    z-index: 3;
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    margin: 16px 24px 0 0;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 12px;
    backdrop-filter: blur(4px);
    color: #4a6fa5;
}

.weather-main {
    display: flex;
    align-items: center;
    gap: 6px;
}

.weather-temp {
    font-size: 26px;
    font-weight: 700;
}

.weather-info {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    line-height: 1.4;
}

.weather-city {
    font-weight: 600;
}

.weather-date {
    color: #6a7fa3;
}

.banner-content {
    position: relative;
    z-index: 3;
    width: 100%;
    max-width: 1100px;
    padding: 0 24px;
}

.banner-left {
    display: flex;
    align-items: flex-end;
    gap: 20px;
}

.banner-avatar {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 4px solid #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    background: #fff;
}

.banner-user {
    padding-bottom: 36px;
    min-width: 0;
}

.nickname-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.nickname {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #3a3a3a;
}

.vip-tag {
    border-radius: 12px;
}

.user-motto {
    margin: 8px 0 0;
    font-size: 13px;
    color: #666;
}

/* 主体容器 */
.zone-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px 24px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
}

.zone-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.zone-main {
    min-width: 0;
}

.zone-card {
    border-radius: 8px;
}

/* 个人成就 */
.achievement-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #333;
}

/* 原力等级 */
.force-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.force-label {
    color: #666;
}

.force-value {
    font-weight: 600;
    color: #333;
}

/* 文章列表 */
.post-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;
}

.post-item {
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f2;
}

.post-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.post-title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
    cursor: pointer;
}

.post-title:hover {
    color: #2080f0;
}

.post-summary {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.post-meta {
    margin-top: 10px;
}

.meta-text {
    font-size: 13px;
    color: #999;
}

/* 响应式 */
@media (max-width: 900px) {
    .zone-container {
        grid-template-columns: 1fr;
    }

    .zone-sidebar {
        order: 2;
    }

    .zone-main {
        order: 1;
    }

    .banner-content {
        flex-wrap: wrap;
    }

    .banner-stats {
        gap: 16px;
    }
}
</style>
