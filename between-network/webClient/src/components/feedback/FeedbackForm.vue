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
    import noteServerRequest from "@/request";
    import feedbackApi from '@/request/api/feedbackApi';

    const emit = defineEmits(['submitted','close']);

    const formRef = ref(null);
    const submitting = ref(false);

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
        formData.level = 2;
        formData.contact = '';
        formData.content = '';
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
            if(isDemand.value)
            {
                let API = {...feedbackApi.addDemand};
                API.data = {
                    content: formData.content,
                    contact: formData.contact
                };
                const responseData = await noteServerRequest(API);
                if(!responseData) return;
                emit('submitted', { type:'demand', id:responseData.data.demandId });
            }
            else
            {
                let API = {...feedbackApi.addIssue};
                API.data = {
                    content: formData.content,
                    contact: formData.contact,
                    level: formData.level
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
</style>
