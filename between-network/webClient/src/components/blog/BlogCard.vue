<template>
    <div class="blog-card" :class="{ 'blog-card--dark': isDarkTheme }" @click="GotoBlogView(blog.id)">
        <n-card>
            <!-- 顶部：头像 + 标题/作者 -->
            <div class="card-head">
                <n-avatar :size="48" class="blog-avatar">
                    <n-icon :size="26">
                        <FileAltRegular />
                    </n-icon>
                </n-avatar>
                <div class="card-head-text">
                    <n-ellipsis line-clamp="1">
                        <span class="card-title" @click.stop="GotoBlogView(blog.id)">
                            {{ blog.title }}
                        </span>
                    </n-ellipsis>
                    <span class="card-meta">{{ blog.author }} · {{ blog.createDate }}</span>
                </div>
            </div>

            <!-- 中间：正文摘要 -->
            <n-ellipsis class="card-body" line-clamp="2" :tooltip="false">
                <span class="card-content">
                    {{ htmlToText(marked(blog.content)) }}
                </span>
            </n-ellipsis>

            <!-- 底部：操作按钮 -->
            <div class="card-actions">
                <n-button quaternary circle @click.stop :size="'small'">
                    <template #icon>
                        <n-icon :size="18"><HeartRegular /></n-icon>
                    </template>
                </n-button>
                <n-button quaternary circle @click.stop :size="'small'">
                    <template #icon>
                        <n-icon :size="18"><ThumbsUpRegular /></n-icon>
                    </template>
                </n-button>
                <n-button quaternary circle @click.stop :size="'small'">
                    <template #icon>
                        <n-icon :size="18"><ThumbsDownRegular /></n-icon>
                    </template>
                </n-button>
            </div>
        </n-card>
    </div>
</template>

<script setup>
    //
    import {htmlToText} from"html-to-text"
    //Markdown渲染插件
    import { marked } from "marked";

    import { FileAltRegular, ThumbsUpRegular, ThumbsDownRegular, HeartRegular } from '@vicons/fa';
    import { toHerf } from '@/router/go';
    import { useThemeStore } from '@/stores/themeStore';
    import { storeToRefs } from 'pinia';

    const props = defineProps(
        {
            blog:{type:Object,required:true},//博客对象
        }
    )

    const themeStore = useThemeStore();
    const { isDarkTheme } = storeToRefs(themeStore);

    const GotoBlogView = (id)=>{
        console.log("go to blog view =>",id);
        toHerf(`/article/${id}`,true,false);
    }
</script>

<style scoped>
/* ===== 卡片容器 ===== */
.blog-card {
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.blog-card :deep(.n-card) {
    border: none;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
    transition: box-shadow 0.25s ease;
}

.blog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(32, 128, 240, 0.12);
}

.blog-card:hover :deep(.n-card) {
    box-shadow: 0 4px 16px rgba(32, 128, 240, 0.1), 0 0 0 1px rgba(32, 128, 240, 0.15);
    background: linear-gradient(135deg, #f0f6ff 0%, #ffffff 100%);
}

/* ===== 顶部：头像 + 标题/作者 ===== */
.card-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 10px;
}

.blog-avatar {
    flex-shrink: 0;
    background: #e8edf4 !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-head-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.card-title {
    font-weight: 700;
    font-size: 17px;
    line-height: 1.4;
    color: #1a1a2e;
    cursor: pointer;
    transition: color 0.2s ease;
}

.blog-card:hover .card-title {
    color: #2080f0;
}

.card-meta {
    font-size: 12px;
    color: #9ca3af;
}

/* ===== 正文摘要 ===== */
.card-body {
    margin-bottom: 14px;
}

.card-content {
    font-size: 13px;
    line-height: 1.7;
    color: #6b7280;
}

/* ===== 底部操作栏 ===== */
.card-actions {
    padding-top: 12px;
    border-top: 1px solid #f0f0f2;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.blog-card:hover .card-actions {
    border-top-color: #e0e5f0;
}

.card-actions :deep(.n-button) {
    color: #9ca3af;
    transition: color 0.2s ease, background-color 0.2s ease;
}

.card-actions :deep(.n-button:hover) {
    color: #2080f0;
    background-color: rgba(32, 128, 240, 0.06);
}

/* ===== 暗色主题 ===== */
.blog-card--dark :deep(.n-card) {
    background: #1a1a24;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.blog-card--dark:hover :deep(.n-card) {
    box-shadow: 0 4px 16px rgba(32, 128, 240, 0.15), 0 0 0 1px rgba(32, 128, 240, 0.2);
    background: #1f1f2a;
}

.blog-card--dark .blog-avatar {
    background: #2a2a36 !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.blog-card--dark .card-title {
    color: #e0e0e8;
}

.blog-card--dark:hover .card-title {
    color: #63a4ff;
}

.blog-card--dark .card-meta {
    color: #7a7a8c;
}

.blog-card--dark .card-content {
    color: #8a8a9a;
}

.blog-card--dark .card-actions {
    border-top-color: rgba(255, 255, 255, 0.08);
}

.blog-card--dark:hover .card-actions {
    border-top-color: rgba(255, 255, 255, 0.12);
}

.blog-card--dark .card-actions :deep(.n-button) {
    color: #7a7a8c;
}

.blog-card--dark .card-actions :deep(.n-button:hover) {
    color: #63a4ff;
    background-color: rgba(99, 164, 255, 0.1);
}
</style>

<!-- 非 scoped 样式：修复 n-ellipsis tooltip 中标题文字颜色 -->
<style>
.n-tooltip .card-title {
    color: #fff !important;
}
</style>