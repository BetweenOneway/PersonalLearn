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
            <template v-if="demand">
                <h1 class="title">{{ demand.title }}</h1>
                <n-space align="center" :size="10">
                    <n-tag :type="demandStatus.tagType" size="small" :bordered="false">{{ demandStatus.status }}</n-tag>
                    <n-text depth="3">提交人：{{ demand.submitter }}</n-text>
                    <n-text depth="3">{{ demand.date }}</n-text>
                    <n-text depth="3">{{ demand.vote }} 人期待</n-text>
                </n-space>
            </template>
        </div>

        <!--需求不存在-->
        <n-empty v-if="!demand" description="该需求不存在或已被删除">
            <template #extra>
                <n-button size="small" @click="goBack">返回反馈列表</n-button>
            </template>
        </n-empty>

        <template v-else>
            <!--顶部：需求流转步骤-->
            <n-card :bordered="false" class="panel-card steps-card">
                <n-steps :current="currentStep" :status="stepStatus" size="medium">
                    <n-step
                        v-for="(stepName,index) in demandSteps"
                        :key="stepName"
                        :title="stepName"
                        :description="stepDescriptions[index]"
                    />
                </n-steps>
            </n-card>

            <!--底部：需求内容 + 评论-->
            <n-grid cols="1 m:3" responsive="screen" :x-gap="24" :y-gap="24">
                <n-gi span="1 m:2">
                    <n-card title="需求内容" :bordered="false" class="panel-card">
                        <template #header-extra>
                            <n-progress
                                type="line"
                                style="width:160px"
                                :percentage="demand.progress"
                                :height="8"
                                :border-radius="4"
                                :fill-border-radius="4"
                                :processing="demand.progress < 100"
                            />
                        </template>
                        <n-space vertical :size="12">
                            <p v-for="(paragraph,index) in contentParagraphs" :key="index" class="content-paragraph">
                                {{ paragraph }}
                            </p>
                        </n-space>
                    </n-card>
                </n-gi>

                <n-gi span="1 m:1">
                    <n-card title="需求进度" :bordered="false" class="panel-card">
                        <n-space vertical :size="16">
                            <div>
                                <n-text depth="3">当前阶段</n-text>
                                <div class="stage-text">{{ demandSteps[currentStep] }}</div>
                            </div>
                            <div>
                                <n-text depth="3">整体进度</n-text>
                                <div class="stage-text">{{ demand.progress }}%</div>
                            </div>
                            <div>
                                <n-text depth="3">期待人数</n-text>
                                <div class="stage-text">{{ demand.vote }}</div>
                            </div>
                            <n-button block secondary type="primary" :loading="voting" @click="voteDemand">
                                我也期待（+1）
                            </n-button>
                            <n-divider style="margin:0" />
                            <div>
                                <n-text depth="3">参与讨论</n-text>
                                <div class="stage-text">{{ demand.comments.length }} 条评论</div>
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
                                placeholder="说说你的看法或补充使用场景"
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
                        <n-empty v-if="demand.comments.length === 0" description="还没有评论，来抢沙发" />
                        <n-list v-else>
                            <n-list-item v-for="comment in demand.comments" :key="comment.id">
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
    import { ArrowBackRound } from '@vicons/material';
    import { toHerf } from '@/router/go';
    import noteServerRequest from '@/request';
    import feedbackApi from '@/request/api/feedbackApi';
    import { demandSteps, getDemandStatus, getContentTitle, formatTime, formatCommentTime } from './feedbackConst.js';

    const route = useRoute();

    //需求详情
    const demand = ref(null);
    const commenting = ref(false);
    const voting = ref(false);
    const commentText = ref('');

    //步骤描述
    const stepDescriptions = [
        '收到用户反馈并登记',
        '评估价值与可行性',
        '确定迭代与开发计划',
        '功能开发与自测',
        '灰度验证后正式发布'
    ];

    //当前所处步骤
    const currentStep = computed(()=> demand.value ? Number(demand.value.step) : 0);

    //需求状态文案与配色
    const demandStatus = computed(()=> demand.value
        ? getDemandStatus(demand.value.step, demand.value.progress)
        : { status:'', tagType:'default' });

    //已上线的需求所有步骤都标记为完成
    const stepStatus = computed(()=> demand.value && Number(demand.value.progress) >= 100 ? 'finish' : 'process');

    //正文按换行拆分成段落展示
    const contentParagraphs = computed(()=>{
        if(!demand.value?.content) return [];
        return String(demand.value.content).split(/\r?\n/).filter(text=>text.trim().length > 0);
    });

    //获取需求详情
    async function getDemandDetail()
    {
        const demandId = route.params.id;
        if(!demandId) return;

        let API = {...feedbackApi.getDemandDetail};
        API.params = { demandId };

        const responseData = await noteServerRequest(API);
        if(!responseData) return;

        const detail = responseData.data;
        demand.value = {
            ...detail,
            title: getContentTitle(detail.content),
            date: formatTime(detail.time),
            comments: (detail.comments ?? []).map(comment=>({
                ...comment,
                commentTime: formatCommentTime(comment.time)
            }))
        };
    }

    //发表评论
    const publishComment = async ()=>{
        const content = commentText.value.trim();
        if(!content || !demand.value) return;

        commenting.value = true;
        try {
            let API = {...feedbackApi.addComment};
            API.data = {
                demandId: demand.value.id,
                content
            };
            const responseData = await noteServerRequest(API);
            if(!responseData) return;
            commentText.value = '';
            //刷新详情，拿到服务端最新的评论列表
            await getDemandDetail();
        } finally {
            commenting.value = false;
        }
    };

    //需求投票（期待这个功能）
    const voteDemand = async ()=>{
        if(!demand.value) return;

        voting.value = true;
        try {
            let API = {...feedbackApi.voteDemand};
            API.data = { demandId: demand.value.id };
            const responseData = await noteServerRequest(API);
            if(!responseData) return;
            demand.value.vote = responseData.data.vote;
        } finally {
            voting.value = false;
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

    getDemandDetail();
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

    .stage-text {
        font-size: 18px;
        font-weight: 600;
        margin-top: 4px;
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
