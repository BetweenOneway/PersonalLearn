<template>
    <div class="container py-6">
        <!--返回 + 标题-->
        <div class="detail-header">
            <n-button quaternary size="small" @click="goBack">
                <template #icon>
                    <n-icon :component="ArrowBackRound" />
                </template>
                返回反馈列表
            </n-button>
            <template v-if="issue">
                <h1 class="title">{{ issue.title }}</h1>
                <n-space align="center" :size="10">
                    <n-tag :type="issueStatus.tagType" size="small" :bordered="false">{{ issueStatus.text }}</n-tag>
                    <n-tag :type="issueLevel.tagType" size="small" :bordered="false">严重程度：{{ issueLevel.text }}</n-tag>
                    <n-text depth="3">提交人：{{ issue.submitter }}</n-text>
                    <n-text depth="3">{{ issue.date }}</n-text>
                </n-space>
            </template>
        </div>

        <!--问题不存在-->
        <n-empty v-if="!issue" description="该问题不存在或已被删除">
            <template #extra>
                <n-button size="small" @click="goBack">返回反馈列表</n-button>
            </template>
        </n-empty>

        <template v-else>
            <!--顶部：问题处理流转步骤-->
            <n-card :bordered="false" class="panel-card steps-card">
                <!--n-steps 的 current 从 1 开始计数，而 issue.handle_status 是 0 基，故 +1 对齐-->
                <n-steps :current="currentStep + 1" :status="stepStatus" size="medium">
                    <n-step
                        v-for="(stepName,index) in issueSteps"
                        :key="stepName"
                        :title="stepName"
                        :description="issueStepDescriptions[index]"
                    />
                </n-steps>
            </n-card>

            <!--底部：问题内容 + 评论-->
            <n-grid cols="1 m:3" responsive="screen" :x-gap="24" :y-gap="24">
                <n-gi span="1 m:2">
                    <n-card title="问题描述" :bordered="false" class="panel-card">
                        <n-space vertical :size="12">
                            <p v-for="(paragraph,index) in contentParagraphs" :key="index" class="content-paragraph">
                                {{ paragraph }}
                            </p>
                        </n-space>
                        <!--附件：有则展示，无则不显示-->
                        <template v-if="issueAttachments.length">
                            <n-divider />
                            <div class="attachment-block">
                                <n-text depth="3" class="attachment-label">附件</n-text>
                                <div class="attachment-grid">
                                    <a
                                        v-for="(url,idx) in issueAttachments"
                                        :key="idx"
                                        :href="url"
                                        target="_blank"
                                        rel="noopener"
                                        class="attachment-item"
                                    >
                                        <img
                                            v-if="isImage(url)"
                                            :src="url"
                                            class="attachment-thumb"
                                            alt="附件"
                                        />
                                        <div v-else class="attachment-file">
                                            <n-icon :size="28" :component="InsertDriveFileOutlined" />
                                            <span class="attachment-file-name">{{ attachmentName(url) }}</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </template>
                    </n-card>
                </n-gi>

                <n-gi span="1 m:1">
                    <n-card title="问题进度" :bordered="false" class="panel-card">
                        <n-space vertical :size="16">
                            <div>
                                <n-text depth="3">当前阶段</n-text>
                                <div class="stage-text">{{ issueSteps[currentStep] }}</div>
                            </div>
                            <div>
                                <n-text depth="3">严重程度</n-text>
                                <div class="stage-text">{{ issueLevel.text }}</div>
                            </div>
                            <div>
                                <n-text depth="3">处理状态</n-text>
                                <div class="stage-text">{{ issueStatus.text }}</div>
                            </div>
                            <div>
                                <n-text depth="3">处理说明</n-text>
                                <div class="stage-desc">{{ issue.handleDesc || '暂无处理说明' }}</div>
                            </div>
                            <n-divider style="margin:0" />
                            <div>
                                <n-text depth="3">参与讨论</n-text>
                                <div class="stage-text">{{ issue.comments.length }} 条评论</div>
                            </div>
                        </n-space>
                    </n-card>
                </n-gi>

                <n-gi span="1 m:2">
                    <n-card title="评论" :bordered="false" class="panel-card">
                        <!--发表评论-->
                        <div class="comment-editor">
                            <n-input
                                v-model:value="commentText"
                                type="textarea"
                                placeholder="补充问题细节或描述你的复现步骤"
                                :maxlength="300"
                                show-count
                                :autosize="{minRows:3,maxRows:6}"
                            />
                            <div class="comment-editor-footer">
                                <n-button type="primary" size="small" :loading="commenting" :disabled="!commentText.trim()" @click="publishComment">
                                    发表评论
                                </n-button>
                            </div>
                        </div>

                        <n-divider />

                        <!--评论列表-->
                        <n-empty v-if="issue.comments.length === 0" description="还没有评论，来抢沙发" />
                        <n-list v-else>
                            <n-list-item v-for="comment in issue.comments" :key="comment.id">
                                <n-thing>
                                    <template #avatar>
                                        <n-avatar round size="medium" :style="{backgroundColor: avatarColor(comment.user)}">
                                            {{ comment.user.charAt(0) }}
                                        </n-avatar>
                                    </template>
                                    <template #header>
                                        {{ comment.user }}
                                    </template>
                                    <template #header-extra>
                                        <n-text depth="3" class="comment-time">{{ comment.commentTime }}</n-text>
                                    </template>
                                    <template #description>
                                        {{ comment.content }}
                                    </template>
                                </n-thing>
                            </n-list-item>
                        </n-list>
                    </n-card>
                </n-gi>
            </n-grid>
        </template>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { ArrowBackRound, InsertDriveFileOutlined } from '@vicons/material';
    import { toHerf } from '@/router/go';
    import noteServerRequest from '@/request';
    import feedbackApi from '@/request/api/feedbackApi';
    import { issueSteps, issueStepDescriptions, getIssueStatus, issueLevelMap, getContentTitle, formatTime, formatCommentTime } from './feedbackConst.js';

    const route = useRoute();

    //问题详情
    const issue = ref(null);
    const commenting = ref(false);
    const commentText = ref('');

    //当前所处步骤
    const currentStep = computed(()=> issue.value ? Number(issue.value.handleStatus) : 0);

    //问题处理状态文案与配色
    const issueStatus = computed(()=> issue.value
        ? getIssueStatus(issue.value.handleStatus)
        : { text:'', tagType:'default' });

    //问题严重程度文案与配色
    const issueLevel = computed(()=> issue.value
        ? (issueLevelMap[Number(issue.value.level)] ?? issueLevelMap[1])
        : issueLevelMap[1]);

    //已修复的问题所有步骤都标记为完成
    const stepStatus = computed(()=> issue.value && Number(issue.value.handleStatus) >= 3 ? 'finish' : 'process');

    //正文按换行拆分成段落展示
    const contentParagraphs = computed(()=>{
        if(!issue.value?.content) return [];
        return String(issue.value.content).split(/\r?\n/).filter(text=>text.trim().length > 0);
    });

    //附件地址列表：后端以 JSON 字符串存储，这里解析为数组（无附件则为空）
    const issueAttachments = computed(()=>{
        const raw = issue.value?.attachments;
        if(!raw) return [];
        let list = [];
        if(typeof raw === 'string'){
            try { list = JSON.parse(raw); } catch(e){ list = []; }
        } else if(Array.isArray(raw)){
            list = raw;
        }
        return Array.isArray(list) ? list : [];
    });

    //判断附件是否为图片（用于缩略图预览）
    const isImage = (url)=>{
        return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url || '');
    };

    //从附件地址中提取文件名
    const attachmentName = (url)=>{
        if(!url) return '';
        const clean = url.split('?')[0];
        return clean.substring(clean.lastIndexOf('/') + 1);
    };

    //获取问题详情
    async function getIssueDetail()
    {
        const issueId = route.params.id;
        if(!issueId) return;

        let API = {...feedbackApi.getIssueDetail};
        API.params = { issueId };

        const responseData = await noteServerRequest(API);
        if(!responseData) return;

        const detail = responseData.data;
        console.log('get Issue detail=>',detail)
        issue.value = {
            ...detail,
            //显式解析关键数值字段：后端字段缺失或类型异常时，
            //保证 handleStatus / level 始终为有效数字，避免步骤条与严重程度展示错乱
            handleStatus: Number(detail.handle_status) || 0,
            level: Number(detail.level) || 1,
            title: detail.title || getContentTitle(detail.content),
            date: formatTime(detail.time),
            handleDesc: detail.handle_desc || '',
            comments: (detail.comments ?? []).map(comment=>({
                ...comment,
                commentTime: formatCommentTime(comment.time)
            }))
        };
        console.log('get Issue detail parsed issue=>',issue.value)
    }

    //发表评论
    const publishComment = async ()=>{
        const content = commentText.value.trim();
        if(!content || !issue.value) return;

        commenting.value = true;
        try {
            let API = {...feedbackApi.addIssueComment};
            API.data = {
                issueId: issue.value.id,
                content
            };
            const responseData = await noteServerRequest(API);
            if(!responseData) return;
            commentText.value = '';
            //刷新详情，拿到服务端最新的评论列表
            await getIssueDetail();
        } finally {
            commenting.value = false;
        }
    };

    //头像配色
    const avatarColor = (name)=>{
        const colors = ['#18a058', '#2080f0', '#f0a020', '#d03050', '#722ed1'];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const goBack = ()=>{
        toHerf('/feedback');
    };

    getIssueDetail();
</script>

<style scoped>
    .container {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding-right: 15px;
        padding-left: 15px;
        max-width: 1140px;
    }

    .py-6 {
        padding-top: 3rem;
        padding-bottom: 4rem;
    }

    .detail-header {
        margin-bottom: 24px;
    }

    .title {
        font-size: 28px;
        font-weight: 700;
        margin: 8px 0;
    }

    .panel-card {
        height: 100%;
    }

    .steps-card {
        margin-bottom: 24px;
    }

    .content-paragraph {
        margin: 0;
        line-height: 1.8;
    }

    .attachment-block {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .attachment-label {
        font-size: 13px;
    }

    .attachment-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .attachment-item {
        display: block;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e6e9ef;
        background: #f7f9fc;
        text-decoration: none;
        transition: box-shadow 0.15s, transform 0.15s;
    }

    .attachment-item:hover {
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        transform: translateY(-1px);
    }

    .attachment-thumb {
        display: block;
        width: 120px;
        height: 120px;
        object-fit: cover;
    }

    .attachment-file {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 120px;
        height: 120px;
        padding: 8px;
        color: #357abd;
    }

    .attachment-file-name {
        max-width: 104px;
        font-size: 12px;
        color: #555;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .stage-text {
        font-size: 18px;
        font-weight: 600;
        margin-top: 4px;
    }

    .stage-desc {
        margin-top: 4px;
        line-height: 1.6;
        color: #444;
    }

    .comment-editor-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
    }

    .comment-time {
        font-size: 13px;
    }
</style>
