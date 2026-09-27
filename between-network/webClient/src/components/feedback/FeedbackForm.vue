<template>
    <div class="feedback-form">
        <n-grid cols="1 m:2" responsive="screen" :x-gap="24" :y-gap="24">
            <n-gi>
                <n-card title="提交反馈" :bordered="false" class="feedback-card">
                    <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="top">
                        <n-form-item label="反馈类型" path="type">
                            <n-select
                                v-model:value="formData.type"
                                :options="feedbackTypes"
                                placeholder="请选择反馈类型"
                            />
                        </n-form-item>
                        <n-form-item label="反馈标题" path="title">
                            <n-input
                                v-model:value="formData.title"
                                placeholder="一句话概括你的需求或问题"
                                maxlength="50"
                                show-count
                                clearable
                            />
                        </n-form-item>
                        <n-form-item v-if="!isDemand" label="严重程度" path="level">
                            <n-select
                                v-model:value="formData.level"
                                :options="issueLevels"
                                placeholder="请选择严重程度"
                            />
                        </n-form-item>
                        <n-form-item label="联系方式" path="contact">
                            <n-input
                                v-model:value="formData.contact"
                                placeholder="邮箱 / 手机号，方便我们回复你（选填）"
                                maxlength="64"
                                clearable
                            />
                        </n-form-item>
                        <n-form-item label="反馈内容" path="content">
                            <n-input
                                v-model:value="formData.content"
                                type="textarea"
                                placeholder="请描述你遇到的问题或建议，越详细越好"
                                :maxlength="500"
                                show-count
                                :autosize="{minRows:6,maxRows:12}"
                            />
                        </n-form-item>
                        <n-form-item label="附件">
                            <div class="attachment-area">
                                <n-button tertiary size="small" :disabled="uploading" @click="triggerFileInput">
                                    <template #icon>
                                        <n-icon :component="AttachFileOutlined" />
                                    </template>
                                    添加附件
                                </n-button>
                                <input
                                    ref="fileInputRef"
                                    type="file"
                                    multiple
                                    class="file-input-hidden"
                                    @change="onFileChange"
                                />
                                <div v-if="attachments.length" class="attachment-list">
                                    <div
                                        v-for="(file, idx) in attachments"
                                        :key="idx"
                                        class="attachment-item"
                                    >
                                        <n-icon :size="16" :component="InsertDriveFileOutlined" class="attachment-icon" />
                                        <span class="attachment-name" :title="file.name">{{ file.name }}</span>
                                        <span class="attachment-size">{{ formatSize(file.size) }}</span>
                                        <n-button
                                            text
                                            size="tiny"
                                            type="error"
                                            :disabled="uploading"
                                            @click="removeAttachment(idx)"
                                        >移除</n-button>
                                    </div>
                                </div>
                                <span v-else class="attachment-tip">支持图片、日志等文件，选填</span>
                            </div>
                        </n-form-item>
                        <n-space align="center">
                            <n-button type="primary" :loading="submitting" @click="submitFeedback">
                                {{ isDemand ? '提交需求' : '提交问题' }}
                            </n-button>
                            <n-button quaternary @click="resetForm">重置</n-button>
                            <n-button quaternary @click="emit('close')">收起</n-button>
                        </n-space>
                    </n-form>
                </n-card>
            </n-gi>

            <n-gi>
                <n-card title="常见问题" :bordered="false" class="feedback-card">
                    <n-collapse>
                        <n-collapse-item title="提交后会怎么处理？" name="1">
                            「功能建议」会进入需求池，按 需求提交 → 需求评审 → 需求排期 → 需求研发 → 需求发布 的流程推进；
                            「功能异常」等问题会进入问题列表，确认后安排修复。
                        </n-collapse-item>
                        <n-collapse-item title="笔记数据丢失怎么办？" name="2">
                            笔记采用云端存储，登录后请确认使用的是同一账号。若误删，可在后台管理的回收站中找回。
                        </n-collapse-item>
                        <n-collapse-item title="无法登录或验证码收不到？" name="3">
                            请先检查邮箱地址是否正确、邮件是否被拦截；仍无法解决时可在此提交反馈并附上账号信息。
                        </n-collapse-item>
                    </n-collapse>
                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { AttachFileOutlined, InsertDriveFileOutlined } from '@vicons/material';
    import noteServerRequest from "@/request";
    import feedbackApi from '@/request/api/feedbackApi';

    const emit = defineEmits(['submitted','close']);

    const formRef = ref(null);
    const submitting = ref(false);

    //附件相关
    const fileInputRef = ref(null);
    const attachments = ref([]); // 选中的 File 对象列表
    const uploading = ref(false);

    //表单数据
    const formData = reactive({
        type: 'suggestion',
        title: '',
        level: 2,
        contact: '',
        content: ''
    });

    //反馈类型
    const feedbackTypes = [
        { label: '需求反馈', value: 'suggestion' },
        { label: '问题反馈', value: 'bug' }
    ];

    //问题严重程度（对应后端 level）
    const issueLevels = [
        { label: '轻微', value: 1 },
        { label: '一般', value: 2 },
        { label: '严重', value: 3 }
    ];

    //功能建议进入需求表，其余进入问题表
    const isDemand = computed(()=> formData.type === 'suggestion');

    //表单校验规则
    const formRules = {
        type: {
            required: true,
            message: '请选择反馈类型',
            trigger: ['blur', 'change']
        },
        title: [
            {
                required: true,
                message: '请填写反馈标题',
                trigger: ['input', 'blur']
            },
            {
                min: 2,
                max: 50,
                message: '标题长度 2-50 个字符',
                trigger: ['input', 'blur']
            }
        ],
        content: [
            {
                required: true,
                message: '请填写反馈内容',
                trigger: ['input', 'blur']
            },
            {
                min: 5,
                message: '反馈内容至少 5 个字符',
                trigger: ['input', 'blur']
            }
        ]
    };

    //重置表单
    const resetForm = ()=>{
        formData.type = 'suggestion';
        formData.title = '';
        formData.level = 2;
        formData.contact = '';
        formData.content = '';
        attachments.value = [];
        if(fileInputRef.value) fileInputRef.value.value = '';
    };

    //点击「添加附件」触发隐藏的文件选择框
    const triggerFileInput = ()=>{
        fileInputRef.value?.click();
    };

    //选择文件后加入附件列表（不去重，支持同名多次添加）
    const onFileChange = (e)=>{
        const files = e.target.files;
        if(files && files.length)
        {
            for(let i=0;i<files.length;i++)
            {
                attachments.value.push(files[i]);
            }
        }
        //清空 input，保证删除后仍可重新选择同一文件
        e.target.value = '';
    };

    //移除某个附件
    const removeAttachment = (idx)=>{
        attachments.value.splice(idx, 1);
    };

    //格式化文件大小
    const formatSize = (bytes)=>{
        if(!bytes && bytes !== 0) return '';
        if(bytes < 1024) return bytes + ' B';
        if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    };

    //把附件上传到服务器，返回可访问地址数组
    const uploadAttachments = async ()=>{
        if(attachments.value.length === 0) return [];
        uploading.value = true;
        try {
            const fd = new FormData();
            for(const file of attachments.value)
            {
                fd.append('attachments', file);
            }
            let API = {...feedbackApi.uploadAttachment};
            API.data = fd;
            const res = await noteServerRequest(API);
            if(!res || !res.data || !res.data.urls)
            {
                window.$message?.error('附件上传失败');
                return null;
            }
            return res.data.urls;
        } catch (error) {
            window.$message?.error('附件上传异常');
            return null;
        } finally {
            uploading.value = false;
        }
    };

    //提交反馈
    const submitFeedback = async ()=>{
        try {
            await formRef.value?.validate();
        } catch (error) {
            return;
        }

        submitting.value = true;
        try {
            //先上传附件，拿到可访问地址
            const urls = await uploadAttachments();
            if(urls === null) return; // 上传失败则中止提交
            const attachmentStr = urls.length ? JSON.stringify(urls) : '';

            if(isDemand.value)
            {
                let API = {...feedbackApi.addDemand};
                API.data = {
                    title: formData.title,
                    content: formData.content,
                    contact: formData.contact,
                    attachments: attachmentStr
                };
                const responseData = await noteServerRequest(API);
                if(!responseData) return;
                emit('submitted', { type:'demand', id:responseData.data.demandId });
            }
            else
            {
                let API = {...feedbackApi.addIssue};
                API.data = {
                    title: formData.title,
                    content: formData.content,
                    contact: formData.contact,
                    level: formData.level,
                    attachments: attachmentStr
                };
                const responseData = await noteServerRequest(API);
                if(!responseData) return;
                emit('submitted', { type:'issue', id:responseData.data.issueId });
            }
            resetForm();
        } finally {
            submitting.value = false;
        }
    };
</script>

<style scoped>
    .feedback-card {
        height: 100%;
    }

    .attachment-area {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    /* 隐藏原生文件输入框 */
    .file-input-hidden {
        display: none;
    }

    .attachment-tip {
        color: #8a94a6;
        font-size: 12px;
    }

    .attachment-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .attachment-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background: #f5f7fa;
        border-radius: 6px;
        font-size: 13px;
    }

    .attachment-icon {
        color: #357abd;
        flex-shrink: 0;
    }

    .attachment-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
    }

    .attachment-size {
        color: #8a94a6;
        flex-shrink: 0;
    }
</style>
