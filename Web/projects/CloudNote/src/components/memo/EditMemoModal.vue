<template>
    <n-modal v-model:show="show" :auto-focus="false" :on-after-leave="resetEditMemo">
        <div>
            <!--骨架屏-->
            <n-card size="small" :bordered="false" style="width:460px" v-show="loading">
                <template #default>
                    <!--标题-->
                    <div style="padding:0 14px">
                        <n-skeleton :height="40" :sharp="false"></n-skeleton>
                    </div>

                    <!--便签编辑区域-->
                    <div style="padding:10px 14px 0">
                        <!--置顶 便签容器-->
                        <n-space align="center">
                            <!--置顶文本-->
                            <n-skeleton :width="42" :height="14"></n-skeleton>
                            <!--置顶开关-->
                            <n-skeleton :width="40" :height="22" :sharp="false"></n-skeleton>
                            <n-space align="center">
                                <!--标签文本-->
                                <n-skeleton :width="42" :height="14"></n-skeleton>
                                <!--标签创建按钮-->
                                <n-skeleton :width="38" :height="28" :sharp="false"></n-skeleton>
                            </n-space>
                        </n-space>
                        <!--分割线-->
                        <n-divider style="margin-top:14px"></n-divider>
                        <!--待办事项列表-->
                        <n-skeleton :height="34" :sharp="false"></n-skeleton>
                    </div>
                </template>
                <!--底部 取消 保存-->
                <template #action>
                    <n-grid cols="2" :x-gap="12">
                        <n-gi>
                            <n-skeleton :height="34" :sharp="false"></n-skeleton>
                        </n-gi>
                        <n-gi>
                            <n-skeleton :height="34" :sharp="false"></n-skeleton>
                        </n-gi>
                    </n-grid>
                </template>
            </n-card>
            <!--真实卡片-->
            <n-card v-show="!loading" size="small" :bordered="false" 
            style="width:460px" :clsss="{'memo-card-finished':formValue.finished}">
                <template #default>
                    <n-form ref = "formRef" :model="formValue" :rules="formRules">
                        <n-form-item :show-label="false" :show-feedback="false" path="title">
                            <!--标题-->
                            <n-input v-model:value="formValue.title" size="large" placeholder="便签标题" 
                            style="--n-border:none;background-color: transparent"></n-input>
                        </n-form-item>
                        
                        <!--便签编辑区域-->
                        <div style="padding:10px 14px 0">
                            <!--置顶 便签容器-->
                            <n-space align="center">
                                <n-text depth="3">置顶：</n-text>
                                <n-switch v-model:value="formValue.top"></n-switch>
                                <n-space align="center">
                                    <n-form-item :show-label="false" :show-feedback="false" path="tags">
                                        <!--标签容器-->
                                        <n-text depth="3">标签：</n-text>
                                        <n-dynamic-tags :max="5" v-model:value="formValue.tags" :color="{borderColor:'rgba(0,0,0,0)'}"></n-dynamic-tags>
                                    </n-form-item>
                                </n-space>
                            </n-space>
                            <!--分割线-->
                            <n-divider style="margin-top:14px"></n-divider>
                            <!--待办事项列表-->
                            <n-form-item :show-label="false" :show-feedback="false" path="content">
                                <n-dynamic-input :on-create="onCreateTodoThing" v-model:value="formValue.content">
                                    <template #create-button-default>
                                        添加待办事项
                                    </template>
                                    <!---->
                                    <template #default="{value}">
                                        <div style="display:flex;align-items:center;width:100%">
                                            <!--复选框-->
                                            <n-checkbox v-model:checked="value.checked"></n-checkbox>
                                            <!--待办事项 文本输入框-->
                                            <n-input v-model:value="value.thing" style="margin-left:12px;--n-border:none" placeholder="请输入。。。"></n-input>
                                        </div>
                                    </template>
                                    <!---->
                                    <template #action="{index,create,remove,move}">
                                        <div style="display:flex;align-items:center;margin-left:12px">
                                            <!--添加待办事项按钮-->
                                            <n-button circle tertiary type="tertiary" @click="()=>create(index)" style="margin-right:6px">
                                                <n-icon :component="AddBoxRound" />
                                            </n-button>
                                            <!--删除待办事项按钮-->
                                            <n-button circle tertiary type="tertiary" @click="()=>remove(index)">
                                                <n-icon  :component="DeleteForeverFilled" />
                                            </n-button>
                                        </div>
                                    </template>
                                </n-dynamic-input>
                            </n-form-item>
                            
                        </div>
                    </n-form>
                </template>
                <!--底部 取消 保存-->
                <template #action>
                    <n-grid cols="2" :x-gap="12">
                        <n-gi>
                            <n-button block tertiary @click="show=false">取消</n-button>
                        </n-gi>
                        <n-gi>
                            <n-button block ghost type="primary" @click="saveNewAddMemo">保存</n-button>
                        </n-gi>
                    </n-grid>
                </template>
            </n-card>
        </div>
        
    </n-modal>
</template>

<script setup>
    import {computed,ref,h} from "vue"
    import {
        AddBoxRound,DeleteForeverFilled
    } from "@vicons/material"
    import {useNotification,NText,NSpace} from 'naive-ui'

    //是否显示编辑便签模态框
    const show = ref(false)
    //通知对象
    const notification = useNotification()

    //创建待办事项
    const onCreateTodoThing = ()=>{
        return {
            checked:false,//是否已完成
            ting:''//待办事项
        }
    }

    //编辑便签表单值
    const formValue = ref({
        title:'',//标题
        top:false,//是否置顶
        tags:[],//标签组
        content:[],//待办事项
        finished:computed(()=>{
            const content = formValue.value.content //待办事项
            if(content.length === 0)
            {
                //没有待办事项 未完成
                return false
            }
            return content.every(item=>item.checked)
        })
    })

    //小记编辑表单应用
    const formRef = ref(null)

    //便签编辑表单验证规则
    const formRules = {
        title:{
            required:true,
            message:'请设置便签标题'
        },
        tags:{
            required:true,
            message:'请设置便签标签'
        },
        content:{
            required:true,
            message:'请设置便签事项'
        }
    }

    const saveNewAddMemo = (e)=>{
        formRef.value?.validate(errors=>{
            if(!errors)
            {
                alert('保存成功')
            }
            else
            {
                //所有验证出错消息对象
                const errorMessage = [].concat(...errors)
                notification.error({
                    title:'新增便签保存提醒',
                    content:()=>h(NSpace,{
                        vertical:true
                    },{
                        default:()=>errorMessage.map(
                            (item,index)=>h(
                                NText,{type:'error'},{
                                    default:()=>(index+1) + "："+ item.message
                                }
                            )
                        )
                    })
                })
            }
        })
    }

    //是否处于加载中
    const loading = ref(true)

    //显示便签编辑模态框
    /**
     * 
     * @param {Number} id 无值 新增 有值编辑
     */
    const showEditModal = (id)=>{
        show.value = true
        loading.value = true
        if(id === null)
        {
            //新增便签
            loading.value = false
        }
        else
        {
            //修改便签
            //发送请求 根据便签编号获取最新的便签信息
            //
            setTimeout(()=>{
                loading.value = false
            },3000)
        }
    }

    //重置便签编辑框中内容
    const resetEditMemo =()=>{
        formValue.value.title = '' //标题
        formValue.value.top = false //是否置顶
        formValue.value.tags=[] //标签
        formValue.value.content = [] //内容
    }
    //将哪些函数导出
    defineExpose({showEditModal})
</script>

<style scoped>
    .n-card.memo-card-finished{
        background-image: url("@/assets/finish.png");
        background-repeat:no-repeat;
        background-position: 360px 0;
        animation:finished 0.25s linear forwards;
    }

    @keyframes finished{
        from {
            background-size:130px 130px;
        }
        to{
            background-size:100px 100px;
        }
    }
</style>