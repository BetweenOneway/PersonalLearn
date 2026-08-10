<template>
    <div class="article-page">
        <!-- 三栏内容区 -->
        <div class="article-layout">
            <!-- 左侧：作者信息栏 + 互动按钮 -->
            <aside class="author-sidebar">
                <!-- 作者卡片 -->
                <div class="author-card" v-show="!authorInfoLoading">
                    <div class="author-head">
                        <img class="author-avatar" :src="authorInfo.headPic" alt="" />
                        <span class="author-name">{{ authorInfo.nickName || '匿名作者' }}</span>
                    </div>

                    <div class="author-subscribe">
                        <n-button
                            size="small"
                            type="warning"
                            block
                            :ghost="isSubscribed"
                            @click="handleSubscribe"
                        >
                            {{ isSubscribed ? '已订阅' : '+ 订阅' }}
                        </n-button>
                    </div>

                    <div class="author-stats">
                        <dl>
                            <dd>{{ authorArticleCount }}</dd>
                            <dt>文章</dt>
                        </dl>
                        <!-- <dl>
                            <dd>{{ authorReadCount }}</dd>
                            <dt>说说</dt>
                        </dl> -->
                        <dl>
                            <dd>{{ subscribeCount }}</dd>
                            <dt>粉丝</dt>
                        </dl>
                    </div>

                    <div class="author-link" @click="goAuthorHome">
                        查看TA的空间 >
                    </div>
                </div>

                <!-- 互动按钮区 -->
                <div class="action-bar">
                    <div class="action-item"
                        :class="{ active: liked }"
                        @click="handleLike"
                    >
                        <n-icon size="22" :component="liked ? ThumbUpAltFilled : ThumbUpAltOutlined" />
                        <span class="action-count">{{ likeCount }}</span>
                    </div>
                    <div class="action-item" @click="scrollToComment">
                        <n-icon size="22" :component="CommentOutlined" />
                        <span class="action-count">{{ commentCount }}</span>
                    </div>
                    <div
                        class="action-item collect-item"
                        :class="{ active: collected, 'collect-active': collected }"
                        @click="handleCollect"
                    >
                        <n-icon size="22" :component="collected ? StarRound : StarBorderRound" />
                        <span class="action-label">收藏</span>
                    </div>
                    <div class="action-item" @click="handleShare">
                        <n-icon size="22" :component="ShareOutlined" />
                        <span class="action-label">分享</span>
                    </div>
                </div>
            </aside>

            <!-- 中间：博客内容 -->
            <main class="article-main">
                <div class="article-header">
                    <h2 class="article-title">{{ blogInfo.title }}</h2>
                    <div class="article-meta">
                        <span class="meta-time">{{ formatTime(blogInfo.update_time) }}</span>
                        <span class="meta-location">发布于：北京市</span>
                        <span class="meta-author">来源：{{ authorInfo.nickName || '匿名作者' }}</span>
                    </div>
                </div>
                <div ref="editorContainer" class="article-body"></div>

                <!-- 评论区占位 -->
                <div id="comment-area" class="comment-area">
                    <n-divider />
                    <n-empty description="评论区正在建设中" />
                </div>
            </main>

            <!-- 右侧：广告 + 热门精选占位 -->
            <aside class="promo-sidebar">
                <div class="right-sticky">
                    <!-- 广告位 -->
                    <div class="promo-card ad-card">
                        <div class="promo-label">广告</div>
                        <div class="promo-placeholder">
                            <n-icon :size="32" :component="BookOpen" />
                            <p class="promo-text">广告位</p>
                            <p class="promo-hint">等待投放</p>
                        </div>
                    </div>

                    <!-- 热门精选位 -->
                    <div class="promo-card hot-card">
                        <div class="promo-title">热门精选</div>
                        <div class="promo-placeholder">
                            <n-icon :size="32" :component="WhatshotRound" />
                            <p class="promo-text">热门精选</p>
                            <p class="promo-hint">推荐内容占位</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { BookOpen } from '@vicons/fa';
    import {
        WhatshotRound,
        ThumbUpAltOutlined,
        ThumbUpAltFilled,
        CommentOutlined,
        StarBorderRound,
        StarRound,
        ShareOutlined
    } from '@vicons/material';
    import { useMessage } from 'naive-ui';
    import dayjs from 'dayjs';

    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';
    import * as echarts from 'echarts';

    import noteServerRequest from '@/request';
    import noteApi from '@/request/api/noteApi';
    import userApi from '@/request/api/userApi';
    import { likeApi, collectApi, commentApi, subscribeApi } from '@/request/api/interactionApi';
    import { useUserStore } from '@/stores/userStore';

    const propsData = defineProps({
        id: { type: String, required: true },
    });

    const router = useRouter();
    const message = useMessage();

    const blogContentLoading = ref(true);
    const authorInfoLoading = ref(true);
    const editorContainer = ref(null);

    let cherryInstance = null;
    let authorInfo = ref({});
    let blogInfo = ref({});
    const noteInfo = ref({});

    const liked = ref(false);
    const collected = ref(false);
    const likeCount = ref(1);
    const commentCount = ref(0);
    const isSubscribed = ref(false);
    const subscribeCount = ref(0);

    const authorArticleCount = computed(() => {
        const count = noteInfo.value?.author?.note_count;
        return (typeof count === 'number' && !isNaN(count)) ? count : '-';
    });
    const authorReadCount = computed(() => {
        const base = blogInfo.value.content?.length || 0;
        return base > 0 ? Math.floor(base * 1.5) : '-';
    });

    const formatTime = (date) => {
        if (!date) return '';
        return dayjs(date).format('YYYY-MM-DD HH:mm');
    };

    async function GetBlogInfo() {
        let API = { ...noteApi.getNotePublicInfo };
        API.params = { noteId: propsData.id };
        let responseData = await noteServerRequest(API);
        if (!responseData) return null;
        blogInfo.value.title = responseData.data.title;
        blogInfo.value.update_time = responseData.data.update_time;
        blogInfo.value.content = responseData.data.content;
        //保存完整返回（含 author），供 authorArticleCount 等使用
        noteInfo.value = responseData.data || {};
        authorInfo.value.id = noteInfo.value.author?.id ?? responseData.data.u_id;

        cherryInstance.setValue(blogInfo.value.content);
        blogContentLoading.value = false;
        return responseData;
    }

    async function GetAuthorInfo() {
        //文章未取到作者 id 时，无需再查作者信息
        if (!authorInfo.value.id) {
            authorInfoLoading.value = false;
            return;
        }
        let API = { ...userApi.getUserPublicInfo };
        API.params = { UserId: authorInfo.value.id };
        let responseData = await noteServerRequest(API);
        if (!responseData) return;
        authorInfo.value.nickName = responseData.data.nickName;
        authorInfo.value.headPic = responseData.data.headPic;
        authorInfo.value.level = responseData.data.level;
        authorInfoLoading.value = false;
    }

    const handleLike = async () => {
        let API = { ...likeApi.toggleLike };
        API.data = { objectId: propsData.id, type: 1 };
        await noteServerRequest(API).then((responseData) => {
            if (!responseData) return;
            liked.value = responseData.data.isLiked;
            if (liked.value) {
                likeCount.value += 1;
                message.success('点赞成功');
            } else {
                likeCount.value = Math.max(0, likeCount.value - 1);
                message.success('已取消点赞');
            }
        });
    };

    const handleCollect = async () => {
        let API = { ...collectApi.toggleCollect };
        API.data = { objectId: propsData.id, type: 1 };
        await noteServerRequest(API).then((responseData) => {
            if (!responseData) return;
            collected.value = responseData.data.isFavorited;
            message.success(collected.value ? '收藏成功' : '已取消收藏');
        });
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            message.success('链接已复制');
        } else {
            message.info('请手动复制链接分享');
        }
    };

    const handleSubscribe = async () => {
        const userStore = useUserStore();
        if (!userStore.token) {
            message.warning('请先登录后再订阅');
            return;
        }
        if (!authorInfo.value.id) {
            message.warning('作者信息加载中，请稍后再试');
            return;
        }

        const API = {
            ...subscribeApi.toggleSubscribe,
            data: { objectId: authorInfo.value.id, type: 1 }
        };
        try {
            const res = await noteServerRequest(API);
            if (res && res.data) {
                isSubscribed.value = !!res.data.isSubscribed;
                // 同步刷新订阅数（粉丝数）
                subscribeCount.value = isSubscribed.value
                    ? subscribeCount.value + 1
                    : Math.max(0, subscribeCount.value - 1);
                message.success(isSubscribed.value ? '订阅成功' : '已取消订阅');
            } else {
                message.error('操作失败，请稍后再试');
            }
        } catch (err) {
            message.error('操作失败，请稍后再试');
        }
    };

    async function loadSubscribeCount() {
        if (!authorInfo.value.id) return;
        const res = await noteServerRequest({
            ...subscribeApi.getSubscribeCount,
            params: { objectId: authorInfo.value.id, type: 1 }
        }).catch(() => null);
        if (res && res.data) {
            subscribeCount.value = res.data.subscribeCount ?? 0;
        }
    }

    const scrollToComment = () => {
        const el = document.getElementById('comment-area');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const goAuthorHome = () => {
        if (authorInfo.value.id) {
            router.push(`/zone/${authorInfo.value.id}`);
        }
    };

    async function LoadInteractionStatus() {
        let type = 1;
        const userStore = useUserStore();
        const isLogin = !!userStore.token;

        const requests = [];
        // 查询失败时（业务失败返回 null，或 HTTP 层异常 reject）统一按未收藏/未点赞处理
        const safeCollect = noteServerRequest({ ...collectApi.checkFavourite, params: { objectId: propsData.id, type } })
            .then((res) => {
                // 仅当请求成功且明确返回已收藏时才置为 true，否则保持默认未收藏
                if (res) collected.value = !!res.data.isFavorited;
            })
            .catch(() => {
                collected.value = false;
            });

        const safeLike = noteServerRequest({ ...likeApi.checkLike, params: { objectId: propsData.id, type } })
            .then((res) => {
                if (res) liked.value = !!res.data.isLiked;
            })
            .catch(() => {
                liked.value = false;
            });

        // 订阅状态查询需作者编号，作者信息加载完成后再发起
        const safeSubscribe = Promise.resolve().then(async () => {
            if (!authorInfo.value.id) return;
            return noteServerRequest({ ...subscribeApi.checkSubscribe, params: { objectId: authorInfo.value.id, type } })
                .then((res) => {
                    if (res) isSubscribed.value = !!res.data.isSubscribed;
                })
                .catch(() => {
                    isSubscribed.value = false;
                });
        });

        // 未登录时无需查询，直接按未收藏/未点赞处理
        if (isLogin) {
            requests.push(safeLike, safeCollect, safeSubscribe);
        } else {
            liked.value = false;
            collected.value = false;
            isSubscribed.value = false;
        }

        requests.push(
            noteServerRequest({ ...likeApi.getLikeCount, params: { objectId: propsData.id, type } })
                .then((res) => {
                    if (res) likeCount.value = res.data.likeCount;
                })
                .catch(() => {})
        );
        requests.push(
            noteServerRequest({ ...commentApi.getCommentCount, params: { objectId: propsData.id, type } })
                .then((res) => {
                    if (res) commentCount.value = res.data.commentCount;
                })
                .catch(() => {})
        );

        await Promise.all(requests);
    }

    onMounted(async () => {
        cherryInstance = new Cherry({
            el: editorContainer.value,
            value: blogInfo.value.content,
            externals: {
                echarts: echarts,
            },
            editor: {
                defaultModel: 'previewOnly',
            },
            toolbars: {
                toolbar: [],
                sidebar: [],
                toolbarRight: [],
                bubble: false,
                float: false,
                hiddenToolbar: ['panel', 'justify'],
            },
        });

        let blogRes = await GetBlogInfo();
        //文章不存在或未公开时，响应拦截器已跳 404，此处直接中止后续加载
        if (!blogRes) return;
        await GetAuthorInfo();
        await LoadInteractionStatus();
        await loadSubscribeCount();
    });

    onUnmounted(() => {
        cherryInstance.destroy();
    });
</script>

<style scoped>
/* ===== 页面整体 上下两栏===== */
.article-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
}

/* ===== 三栏布局 ===== */
.article-layout {
    flex: 1;
    display: flex;
    margin: 0 auto;
    padding: 24px 16px;
    max-width: 1320px;
    width: 100%;
    gap: 24px;
    align-items: flex-start;
}

.author-sidebar {
    align-self: stretch;
}

/* ===== 左侧：作者信息栏 + 互动按钮 ===== */
.author-sidebar {
    width: 220px;
    flex-shrink: 0;
    position: relative;
}

.author-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.author-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.author-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
}

.author-name {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
}

.author-subscribe {
    width: 100%;
}

.author-stats {
    display: flex;
    justify-content: center;
    gap: 16px;
    width: 100%;
    background: #fafafa;
    border-radius: 6px;
    padding: 12px 0;
}

.author-stats dl {
    text-align: center;
    margin: 0;
    padding: 0 12px;
    position: relative;
}

.author-stats dl:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 24px;
    background: #e8e8e8;
}

.author-stats dd {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
}

.author-stats dt {
    font-size: 12px;
    color: #9ca3af;
    margin: 4px 0 0;
}

.author-link {
    font-size: 13px;
    color: #2080f0;
    cursor: pointer;
}

.author-link:hover {
    color: #4098ff;
}

/* 互动按钮区 */
.action-bar {
    position: sticky;
    top: 12px;
    margin-top: 16px;
    background: #fff;
    border-radius: 8px;
    padding: 8px 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
}

.action-item:hover {
    color: #e74c3c;
    background: #fff0f0;
}

.action-item.collect-item:hover {
    color: #f0a020;
    background: #fff8e6;
}

.action-item.active {
    color: #e74c3c;
}

.action-item.active.collect-active {
    color: #f0a020;
}

.action-count,
.action-label {
    font-size: 12px;
    margin-top: 4px;
}

/* ===== 中间：博客内容 ===== */
.article-main {
    flex: 1;
    min-width: 0;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    padding: 32px 36px;
}

.article-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f2;
}

.article-title {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.4;
    color: #1a1a2e;
    margin: 0 0 16px;
}

.article-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: #888;
}

.article-body {
    min-height: 400px;
    font-size: 15px;
    line-height: 1.85;
    color: #333;
    word-break: break-word;
}

.comment-area {
    margin-top: 48px;
}

/* 修复 cherry-markdown 绝对定位导致溢出，并去掉自带容器样式 */
.article-body :deep(.cherry) {
    position: relative !important;
    height: auto !important;
    min-height: auto !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

.article-body :deep(.cherry-previewer) {
    position: relative !important;
    height: auto !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
}

/* cherry-markdown 内容区域美化 */
.article-body :deep(.cherry-previewer p),
.article-body :deep(p) {
    margin-bottom: 1.2em;
    font-size: 15px;
    line-height: 1.85;
}

.article-body :deep(.cherry-previewer h1),
.article-body :deep(.cherry-previewer h2),
.article-body :deep(.cherry-previewer h3),
.article-body :deep(.cherry-previewer h4),
.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4) {
    margin-top: 1.5em;
    margin-bottom: 0.6em;
    font-weight: 600;
    color: #1a1a2e;
}

.article-body :deep(.cherry-previewer code),
.article-body :deep(code) {
    background: #f5f5f7;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #e74c3c;
}

.article-body :deep(.cherry-previewer pre),
.article-body :deep(pre) {
    background: #f8f9fc;
    border-radius: 8px;
    padding: 16px 20px;
    overflow-x: auto;
}

.article-body :deep(.cherry-previewer blockquote),
.article-body :deep(blockquote) {
    border-left: 4px solid #2080f0;
    padding: 8px 16px;
    margin: 1em 0;
    background: #f0f6ff;
    border-radius: 0 6px 6px 0;
    color: #555;
}

.article-body :deep(.cherry-previewer img),
.article-body :deep(img) {
    max-width: 100%;
    border-radius: 8px;
}

.article-body :deep(.cherry-previewer table),
.article-body :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
}

.article-body :deep(.cherry-previewer th),
.article-body :deep(.cherry-previewer td),
.article-body :deep(th),
.article-body :deep(td) {
    border: 1px solid #e8e8e8;
    padding: 8px 12px;
    text-align: left;
}

.article-body :deep(.cherry-previewer th),
.article-body :deep(th) {
    background: #f5f5f7;
    font-weight: 600;
}

/* ===== 右侧：广告 + 热门精选占位 ===== */
.promo-sidebar {
    width: 240px;
    flex-shrink: 0;
}

.right-sticky {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.promo-card {
    position: relative;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.promo-label {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
    color: #999;
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
}

.promo-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f2;
}

.ad-card {
    position: relative;
}

.promo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    border: 2px dashed #e8e8e8;
    border-radius: 8px;
    color: #c0c4cc;
}

.promo-text {
    margin: 10px 0 4px;
    font-size: 14px;
    font-weight: 500;
    color: #909399;
}

.promo-hint {
    margin: 0;
    font-size: 12px;
    color: #c0c4cc;
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
    .article-layout {
        max-width: 1000px;
    }

    .promo-sidebar {
        display: none;
    }
}

@media (max-width: 900px) {
    .author-sidebar {
        display: none;
    }

    .article-main {
        padding: 20px;
    }
}
</style>
