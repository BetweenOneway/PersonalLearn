<template>
    <div class="zone-page">
        <!-- 顶部背景横幅（QQ空间风格） -->
        <div class="zone-banner">
            <div class="weather-widget" v-show="false">
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

                <n-card class="zone-card" title="原力等级" v-show="false">
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
                    <div v-if="isOwner" class="publisher-box">
                        <n-input
                            class="publisher-input"
                            type="textarea"
                            :rows="2"
                            placeholder="随便说点儿什么"
                            :bordered="false"
                            :resizable="false"
                        />
                        <div class="publisher-actions">
                            <n-button type="primary" class="publisher-action-btn">
                                随口一说
                            </n-button>
                        </div>
                    </div>
                    <n-tabs v-model:value="activeTab" type="line" animated>
                        <n-tab-pane name="article" tab="文章">
                            <div v-if="articleList.length" class="post-list">
                                <div
                                    v-for="post in articleList"
                                    :key="post.id"
                                    class="post-item"
                                    @click="goToNote(post.id)"
                                >
                                    <div class="post-title">{{ post.title }}</div>
                                    <p class="post-summary">{{ post.content }}</p>
                                    <div class="post-meta">
                                        <n-space :size="12" align="center">
                                            <span class="meta-text">{{ post.author }}</span>
                                            <span class="meta-text">{{ post.createDate }}</span>
                                        </n-space>
                                    </div>
                                </div>
                            </div>
                            <n-empty v-else description="暂无文章" />
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
    import { ref, onMounted, computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import {
        EmojiEventsOutlined,
        VerifiedOutlined,
        FavoriteBorderOutlined,
        StarBorderOutlined,
        WorkspacePremiumOutlined,
        NightsStayOutlined
    } from '@vicons/material';

    import noteServerRequest from "@/request";
    import noteApi from "@/request/api/noteApi";
    import userApi from "@/request/api/userApi";
    import { useUserStore } from "@/stores/userStore";
    import { toHerf } from "@/router/go";

    const props = defineProps({
        id: {
            type: String,
            default: ''
        }
    });

    const activeTab = ref('article');

    // 当前访问的作者 id，来自路由 /zone/:id，由博客详情页"查看TA的空间"带入
    const authorId = ref(props.id);

    // 当前登录用户信息
    const userStore = useUserStore();
    const { id: currentUserId } = storeToRefs(userStore);

    // 只有当前登录用户与该空间作者为同一人时，才显示发布输入框
    const isOwner = computed(() => {
        return !!currentUserId.value && currentUserId.value == authorId.value;
    });

    // 文章列表数据
    const articleList = ref([]);

    // 作者信息，初始为兜底值，加载完成后由接口数据覆盖
    const userInfo = ref({
        nickname: '加载中...',
        avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
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

    // 根据 authorId 调用接口获取作者信息，避免通过地址栏传递 author 对象
    async function loadAuthor() {
        if (!authorId.value) return;
        let API = { ...userApi.getUserPublicInfo };
        API.params = { UserId: authorId.value };
        await noteServerRequest(API).then(responseData => {
            if (!responseData) return;
            const data = responseData.data;
            userInfo.value.nickname = data.nickName || userInfo.value.nickname;
            userInfo.value.avatar = data.headPic || userInfo.value.avatar;
            userInfo.value.location = data.location || userInfo.value.location;
            userInfo.value.joinDate = data.joinDate || userInfo.value.joinDate;
            userInfo.value.bio = data.bio || userInfo.value.bio;
        });
    }

    // 获取当前空间作者的公开文章列表，传入的是作者 id 而非登录用户 id
    async function loadArticles() {
        if (!authorId.value) return;
        let API = { ...noteApi.getOpenNoteList };
        API.params = {
            pageIndex: 0,
            pageSize: 20,
            userId: authorId.value
        };
        await noteServerRequest(API).then(responseData => {
            if (responseData) {
                articleList.value = responseData.data;
            }
        });
    }

    // 跳转到笔记详情
    function goToNote(noteId) {
        toHerf(`/article/${noteId}`, true, false);
    }

    onMounted(() => {
        loadAuthor();
        loadArticles();
    });
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

/* 发布输入框（仅空间主人可见） */
.publisher-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    margin-bottom: 16px;
    background: #fff;
    border: 1px solid #e8eaed;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.publisher-input {
    flex: 1;
    min-width: 0;
}

.publisher-input :deep(.n-input-wrapper) {
    background: #f5f6f7;
    border-radius: 8px;
    padding: 10px 12px;
    transition: background 0.2s;
}

.publisher-input :deep(.n-input-wrapper:hover),
.publisher-input :deep(.n-input-wrapper--focus) {
    background: #eef0f2;
}

.publisher-input :deep(.n-input__textarea-el) {
    color: #333;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
}

.publisher-input :deep(.n-input__placeholder) {
    color: #999;
}

.publisher-actions {
    display: flex;
    align-items: center;
    align-self: center;
    flex-shrink: 0;
}

.publisher-action-btn {
    --n-color: #357abd;
    --n-color-hover: #4a90d9;
    --n-color-pressed: #2f6aa3;
    font-weight: 600;
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

/* 文章列表 */
.post-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.post-item {
    padding: 18px 20px;
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 10px;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
}

.post-item:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.post-title {
    font-size: 17px;
    font-weight: 600;
    color: #2c3e50;
}

.post-summary {
    margin: 8px 0 0;
    font-size: 14px;
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
