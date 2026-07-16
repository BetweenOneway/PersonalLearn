<template>
    <div class="article-page">
        <!-- 三栏内容区 -->
        <div class="article-layout">
            <!-- 左侧：作者信息栏 -->
            <aside class="author-sidebar">
                <div class="author-card" v-show="!authorInfoLoading">
                    <!-- 头像 + 名称 -->
                    <div class="author-head">
                        <img class="author-avatar" :src="authorInfo.headPic" alt="" />
                        <span class="author-name">{{ authorInfo.nickName }}</span>
                    </div>

                    <!-- 成就 -->
                    <div class="author-stats">
                        <dl>
                            <dd>200</dd>
                            <dt>原创</dt>
                        </dl>
                        <dl>
                            <dd>2K</dd>
                            <dt>点赞</dt>
                        </dl>
                        <dl>
                            <dd>1W+</dd>
                            <dt>收藏</dt>
                        </dl>
                        <dl>
                            <dd>3K+</dd>
                            <dt>粉丝</dt>
                        </dl>
                    </div>

                    <!-- 关注按钮 -->
                    <div class="author-follow">
                        <n-button size="small" type="primary" block>关注</n-button>
                    </div>
                </div>
            </aside>

            <!-- 中间：博客内容 -->
            <main class="article-main">
                <div class="article-header">
                    <n-flex justify="center">
                        <h2 class="article-title">{{ blogInfo.title }}</h2>
                    </n-flex>
                </div>
                <div ref="editorContainer" class="article-body"></div>
            </main>

            <!-- 右侧：推广区域 -->
            <aside class="promo-sidebar">
                <div class="promo-card">
                    <div class="promo-placeholder">
                        <n-icon :size="32" :component="BookOpen" />
                        <p class="promo-text">推广位</p>
                        <p class="promo-hint">广告或推荐内容</p>
                    </div>
                </div>
            </aside>
        </div>

        <!-- 底部 -->
        <PageFooter />
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref } from 'vue';
    import { BookOpen } from '@vicons/fa';

    import 'cherry-markdown/dist/cherry-markdown.css';
    import Cherry from 'cherry-markdown';

    import PageFooter from '@/components/home/PageFooter.vue';

    import noteServerRequest from '@/request';
    import noteApi from '@/request/api/noteApi';
    import userApi from '@/request/api/userApi';

    const propsData = defineProps({
        id: { type: String, required: true },
    });

    const blogContentLoading = ref(true);
    const authorInfoLoading = ref(true);
    const editorContainer = ref(null);

    let cherryInstance = null;
    let authorInfo = ref({});
    let blogInfo = ref({});

    async function GetBlogInfo() {
        let API = { ...noteApi.getNotePublicInfo };
        API.params = { noteId: propsData.id };
        await noteServerRequest(API).then((responseData) => {
            if (!responseData) return;
            blogInfo.value.title = responseData.data.title;
            blogInfo.value.update_time = responseData.data.update_time;
            blogInfo.value.content = responseData.data.content;
            authorInfo.value.id = responseData.data.u_id;

            cherryInstance.setValue(blogInfo.value.content);
            blogContentLoading.value = false;
        });
    }

    async function GetAuthorInfo() {
        let API = { ...userApi.getUserPublicInfo };
        API.params = { UserId: authorInfo.value.id };
        noteServerRequest(API).then((responseData) => {
            if (!responseData) return;
            authorInfo.value.nickName = responseData.data.nickName;
            authorInfo.value.headPic = responseData.data.headPic;
            authorInfo.value.level = responseData.data.level;
            authorInfoLoading.value = false;
        });
    }

    onMounted(async () => {
        cherryInstance = new Cherry({
            el: editorContainer.value,
            value: blogInfo.value.content,
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

        await GetBlogInfo();
        await GetAuthorInfo();
    });

    onUnmounted(() => {
        cherryInstance.destroy();
    });
</script>

<style scoped>
/* ===== 页面整体 ===== */
.article-page {
    min-height: calc(100vh - var(--nav-bar-height));
    display: flex;
    flex-direction: column;
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
}

/* ===== 左侧：作者信息栏 ===== */
.author-sidebar {
    width: 200px;
    flex-shrink: 0;
}

.author-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    position: sticky;
    top: calc(var(--nav-bar-height) + 24px);
}

.author-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.author-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
}

.author-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a2e;
}

/* 成就统计 */
.author-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0;
    width: 100%;
    background: #fafafa;
    border-radius: 6px;
    padding: 12px 4px;
}

.author-stats dl {
    flex: 0 0 50%;
    text-align: center;
    margin: 0;
    padding: 6px 0;
}

.author-stats dd {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
}

.author-stats dt {
    font-size: 12px;
    color: #9ca3af;
    margin: 2px 0 0;
}

/* 关注按钮 */
.author-follow {
    width: 100%;
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
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f2;
}

.article-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
}

.article-body {
    min-height: 400px;
    font-size: 15px;
    line-height: 1.85;
    color: #333;
    word-break: break-word;
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

/* ===== 右侧：推广区域 ===== */
.promo-sidebar {
    width: 200px;
    flex-shrink: 0;
}

.promo-card {
    position: sticky;
    top: calc(var(--nav-bar-height) + 24px);
    background: #fff;
    border-radius: 8px;
    padding: 24px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.promo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 180px;
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
</style>
