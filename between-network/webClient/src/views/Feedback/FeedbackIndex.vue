<template>
    <div class="container py-6">
        <div class="feedback-header">
            <div>
                <h1 class="title">用户反馈</h1>
                <p class="desc">你的每一条建议，都会让云笔记变得更好用。</p>
            </div>
            <n-button type="primary" size="large" @click="toggleFeedbackForm">
                {{ feedbackFormShow ? '收起反馈' : '我要反馈' }}
            </n-button>
        </div>

        <!--点击"我要反馈"后显示的反馈组件-->
        <div v-show="feedbackFormShow" class="feedback-form-area">
            <feedback-form @submitted="onFeedbackSubmitted" @close="feedbackFormShow = false" />
        </div>

        <!--下半部分：需求进度 / 问题反应-->
        <n-grid cols="1 m:2" responsive="screen" :x-gap="24" :y-gap="24">
            <n-gi>
                <n-card title="需求进度" :bordered="false" class="panel-card">
                    <n-empty v-if="demandList.length === 0" description="还没有需求，点击「我要反馈」提交第一条" />
                    <n-timeline v-else>
                        <n-timeline-item
                            v-for="demand in demandList"
                            :key="demand.id"
                            :type="demand.timelineType"
                        >
                            <template #header>
                                <div class="demand-header">
                                    <n-button text class="demand-title" @click="toDemandDetail(demand.id)">
                                        {{ demand.title }}
                                    </n-button>
                                    <n-text depth="3" class="demand-date">{{ demand.date }}</n-text>
                                </div>
                            </template>
                            <template #default>
                                <div class="demand-item">
                                    <n-space align="center" :size="8" class="demand-meta">
                                        <n-tag :type="demand.tagType" size="small" :bordered="false">{{ demand.status }}</n-tag>
                                        <n-text depth="3">{{ demand.vote }} 人期待</n-text>
                                    </n-space>
                                    <n-progress
                                        type="line"
                                        :percentage="demand.progress"
                                        :height="8"
                                        :border-radius="4"
                                        :fill-border-radius="4"
                                        :processing="demand.progress < 100"
                                    />
                                </div>
                            </template>
                        </n-timeline-item>
                    </n-timeline>
                </n-card>
            </n-gi>

            <n-gi>
                <n-card title="问题反应" :bordered="false" class="panel-card">
                    <n-empty v-if="issueList.length === 0" description="还没有问题反馈" />
                    <n-list v-else hoverable clickable>
                        <n-list-item v-for="issue in issueList" :key="issue.id">
                            <n-thing :title="issue.title" :description="issue.date">
                                <template #header-extra>
                                    <n-space align="center" :size="8">
                                        <n-tag :type="issue.levelTagType" size="small" :bordered="false">{{ issue.levelText }}</n-tag>
                                        <n-tag :type="issue.statusTagType" size="small" :bordered="false">{{ issue.statusText }}</n-tag>
                                    </n-space>
                                </template>
                                <template #default>
                                    <n-text depth="2">{{ issue.description }}</n-text>
                                </template>
                            </n-thing>
                        </n-list-item>
                    </n-list>
                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import FeedbackForm from '@/components/feedback/FeedbackForm.vue';
    import { toHerf } from '@/router/go';
    import noteServerRequest from '@/request';
    import feedbackApi from '@/request/api/feedbackApi';
    import { formatDemandList, formatIssueList } from './feedbackConst.js';

    //是否展开反馈组件
    const feedbackFormShow = ref(false);

    //需求列表与问题列表
    const demandList = ref([]);
    const issueList = ref([]);

    const toggleFeedbackForm = ()=>{
        feedbackFormShow.value = !feedbackFormShow.value;
    };

    //反馈提交成功后收起组件并刷新列表
    const onFeedbackSubmitted = ()=>{
        feedbackFormShow.value = false;
        Init();
    };

    //点击需求名称进入需求详情页
    const toDemandDetail = (id)=>{
        toHerf(`/feedback/demand/${id}`);
    };

    //获取需求列表
    async function getDemandList()
    {
        let API = {...feedbackApi.getDemandList};
        API.params = {
            pageIndex:0,
            pageSize:10
        };
        const responseData = await noteServerRequest(API);
        if(!responseData) return;
        demandList.value = formatDemandList(responseData.data);
    }

    //获取问题列表
    async function getIssueList()
    {
        let API = {...feedbackApi.getIssueList};
        API.params = {
            pageIndex:0,
            pageSize:10
        };
        const responseData = await noteServerRequest(API);
        if(!responseData) return;
        issueList.value = formatIssueList(responseData.data);
    }

    async function Init()
    {
        await getDemandList();
        await getIssueList();
    }

    Init();

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
        padding-top: 4rem;
        padding-bottom: 4rem;
    }

    .feedback-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
    }

    .title {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 8px;
    }

    .desc {
        margin: 0;
        font-weight: 300;
        color: var(--n-text-color-3, #8a8f98);
    }

    .feedback-form-area {
        margin-bottom: 32px;
    }

    .panel-card {
        height: 100%;
    }

    .demand-item {
        width: 100%;
    }

    .demand-meta {
        margin-bottom: 8px;
    }

    .demand-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .demand-title {
        --n-font-size: 15px;
        font-size: 15px;
        font-weight: 600;
    }

    .demand-date {
        font-size: 13px;
        white-space: nowrap;
    }
</style>
