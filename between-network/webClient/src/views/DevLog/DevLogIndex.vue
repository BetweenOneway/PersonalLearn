<template>
    <div class="container py-6">
        <div class="devlog-header">
            <div>
                <h1 class="title">开发日志</h1>
                <p class="desc">记录云笔记每一次迭代的改动，更新进度公开透明。</p>
            </div>
        </div>

        <n-card :bordered="false" class="panel-card">
            <n-empty v-if="devLogList.length === 0" description="还没有开发日志" />
            <n-timeline v-else>
                <n-timeline-item
                    v-for="log in devLogList"
                    :key="log.version"
                    :type="log.timelineType"
                    :title="log.title"
                    :time="log.date"
                >
                    <template #default>
                        <n-space align="center" :size="8" class="log-meta">
                            <n-tag :type="log.tagType" size="small" :bordered="false">{{ log.typeText }}</n-tag>
                            <n-text depth="3">{{ log.version }}</n-text>
                        </n-space>
                        <ul class="log-changes">
                            <li v-for="(change,index) in log.changes" :key="index">
                                <n-tag :type="change.tagType" size="small" :bordered="false" class="change-tag">
                                    {{ change.typeText }}
                                </n-tag>
                                <n-text depth="2">{{ change.content }}</n-text>
                            </li>
                        </ul>
                    </template>
                </n-timeline-item>
            </n-timeline>
        </n-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    //日志类型 => 文案与配色
    const logTypeMap = {
        0: { text: '规划中', tagType: 'default', timelineType: 'default' },
        1: { text: '开发中', tagType: 'info', timelineType: 'info' },
        2: { text: '已发布', tagType: 'success', timelineType: 'success' }
    };

    //改动类型 => 文案与配色
    const changeTypeMap = {
        0: { text: '新增', tagType: 'success' },
        1: { text: '优化', tagType: 'info' },
        2: { text: '修复', tagType: 'warning' }
    };

    // TODO: 后端暂无开发日志接口，以下为示例数据，接口就绪后替换为请求返回
    const devLogList = ref([
        {
            version: 'v1.4.0',
            title: '共享共建：需求进度与问题反馈公开',
            date: '2026-09-26',
            type: 2,
            typeText: logTypeMap[2].text,
            tagType: logTypeMap[2].tagType,
            timelineType: logTypeMap[2].timelineType,
            changes: [
                { type: 0, typeText: changeTypeMap[0].text, tagType: changeTypeMap[0].tagType, content: '新增用户反馈页面，支持提交需求与问题' },
                { type: 0, typeText: changeTypeMap[0].text, tagType: changeTypeMap[0].tagType, content: '新增需求详情页，用步骤条展示需求流转状态' },
                { type: 1, typeText: changeTypeMap[1].text, tagType: changeTypeMap[1].tagType, content: '顶部导航整合为「共享共建」入口' }
            ]
        },
        {
            version: 'v1.3.0',
            title: '编辑器体验优化',
            date: '2026-09-10',
            type: 2,
            typeText: logTypeMap[2].text,
            tagType: logTypeMap[2].tagType,
            timelineType: logTypeMap[2].timelineType,
            changes: [
                { type: 1, typeText: changeTypeMap[1].text, tagType: changeTypeMap[1].tagType, content: '优化图片上传速度，支持拖拽插入' },
                { type: 2, typeText: changeTypeMap[2].text, tagType: changeTypeMap[2].tagType, content: '修复长文滚动时目录高亮错位的问题' }
            ]
        },
        {
            version: 'v1.2.0',
            title: '笔记多端同步',
            date: '2026-08-18',
            type: 2,
            typeText: logTypeMap[2].text,
            tagType: logTypeMap[2].tagType,
            timelineType: logTypeMap[2].timelineType,
            changes: [
                { type: 0, typeText: changeTypeMap[0].text, tagType: changeTypeMap[0].tagType, content: '新增笔记自动保存与冲突提示' },
                { type: 1, typeText: changeTypeMap[1].text, tagType: changeTypeMap[1].tagType, content: '优化笔记列表加载性能' }
            ]
        },
        {
            version: 'v1.5.0',
            title: '笔记协作与导出能力',
            date: '2026-10-20',
            type: 1,
            typeText: logTypeMap[1].text,
            tagType: logTypeMap[1].tagType,
            timelineType: logTypeMap[1].timelineType,
            changes: [
                { type: 0, typeText: changeTypeMap[0].text, tagType: changeTypeMap[0].tagType, content: '笔记支持一键导出 PDF / Markdown' },
                { type: 0, typeText: changeTypeMap[0].text, tagType: changeTypeMap[0].tagType, content: '笔记本支持拖拽排序' }
            ]
        }
    ]);
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

    .devlog-header {
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

    .panel-card {
        height: 100%;
    }

    .log-meta {
        margin-bottom: 10px;
    }

    .log-changes {
        margin: 0;
        padding-left: 0;
        list-style: none;
    }

    .log-changes li {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
    }

    .change-tag {
        flex: none;
    }
</style>
