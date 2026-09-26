//需求流转步骤（与后端 feedback_demand.step 一致）
export const demandSteps = ['需求提交', '需求评审', '需求排期', '需求研发', '需求发布'];

//需求步骤 => 状态文案与配色
export const demandStepMap = {
    0: { status: '需求提交', tagType: 'default', timelineType: 'default' },
    1: { status: '需求评审', tagType: 'default', timelineType: 'default' },
    2: { status: '需求排期', tagType: 'info', timelineType: 'info' },
    3: { status: '需求研发', tagType: 'info', timelineType: 'info' },
    4: { status: '需求发布', tagType: 'warning', timelineType: 'warning' }
};

//问题严重程度（与后端 feedback_issue.level 一致）
export const issueLevelMap = {
    1: { text: '轻微', tagType: 'default' },
    2: { text: '一般', tagType: 'warning' },
    3: { text: '严重', tagType: 'error' }
};

//问题处理状态（与后端 feedback_issue.handle_status 一致）
export const issueStatusMap = {
    0: { text: '待确认', tagType: 'default' },
    1: { text: '处理中', tagType: 'info' },
    2: { text: '待验证', tagType: 'warning' },
    3: { text: '已修复', tagType: 'success' }
};

//根据需求步骤与进度计算展示用的状态
export const getDemandStatus = (step, progress)=>{
    //已排到发布阶段且进度满格，视为已上线
    if(Number(step) === 4 && Number(progress) >= 100)
    {
        return { status: '已上线', tagType: 'success', timelineType: 'success' };
    }
    return demandStepMap[Number(step)] ?? demandStepMap[0];
};

//数据库不再保存标题，列表与详情展示时取正文首行作为标题
export const getContentTitle = (content, maxLength = 30)=>{
    if(!content) return '未命名反馈';
    const firstLine = String(content).split(/\r?\n/).find(text=>text.trim().length > 0) ?? '';
    const title = firstLine.trim();
    if(!title) return '未命名反馈';
    return title.length > maxLength ? `${title.slice(0, maxLength)}…` : title;
};

//把后端返回的需求列表转换成页面展示结构
export const formatDemandList = (list = [])=>{
    return list.map(item=>{
        const demandStatus = getDemandStatus(item.step, item.progress);
        return {
            ...item,
            title: getContentTitle(item.content),
            date: formatTime(item.time),
            status: demandStatus.status,
            tagType: demandStatus.tagType,
            timelineType: demandStatus.timelineType
        };
    });
};

//把后端返回的问题列表转换成页面展示结构
export const formatIssueList = (list = [])=>{
    return list.map(item=>{
        const level = issueLevelMap[Number(item.level)] ?? issueLevelMap[1];
        const handleStatus = issueStatusMap[Number(item.handle_status)] ?? issueStatusMap[0];
        return {
            ...item,
            title: getContentTitle(item.content),
            date: formatTime(item.time),
            levelText: level.text,
            levelTagType: level.tagType,
            statusText: handleStatus.text,
            statusTagType: handleStatus.tagType,
            description: item.handle_desc || item.content || ''
        };
    });
};

//时间格式化：2026-09-20
export const formatTime = (time)=>{
    if(!time) return '';
    const date = new Date(time);
    if(Number.isNaN(date.getTime())) return String(time);
    const month = `${date.getMonth() + 1}`.padStart(2,'0');
    const day = `${date.getDate()}`.padStart(2,'0');
    return `${date.getFullYear()}-${month}-${day}`;
};

//评论时间格式化：2026-09-20 15:03
export const formatCommentTime = (time)=>{
    if(!time) return '';
    const date = new Date(time);
    if(Number.isNaN(date.getTime())) return String(time);
    const month = `${date.getMonth() + 1}`.padStart(2,'0');
    const day = `${date.getDate()}`.padStart(2,'0');
    const hour = `${date.getHours()}`.padStart(2,'0');
    const minute = `${date.getMinutes()}`.padStart(2,'0');
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
};
