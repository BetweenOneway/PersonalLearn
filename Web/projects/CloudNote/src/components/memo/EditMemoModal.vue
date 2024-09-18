<template>
    <!--close-on-esc esc关闭 mask-closable 点击遮罩层关闭-->
    <n-modal v-model:show="show" :auto-focus="false" :on-after-leave="resetEditMemo" transform-origin="center" 
    :close-on-esc="false" :mask-closable="false">
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
                            <n-button :disabled="saveBtnDisabled" block ghost type="primary" @click="saveNewAddMemo">保存</n-button>
                        </n-gi>
                    </n-grid>
                </template>
            </n-card>
        </div>
        
    </n-modal>
</template>

<script setup>
    import {computed,ref,h,onBeforeUnmount} from "vue"
    import {
        AddBoxRound,DeleteForeverFilled
    } from "@vicons/material"
    import {useNotification,NText,NSpace} from 'naive-ui'
    import noteServerRequest  from "../../request"
    import memoApi from '../../request/api/memoApi';
    import bus from 'vue3-eventbus'
    import {disabledBtn} from '../../utils/disabledBtn'

    //是否显示编辑便签模态框
    const show = ref(false)

    //通知对象
    const notification = useNotification()

    //自定义事件
    const emits = defineEmits(['save'])

    //监听是否触发新建便签事件
    bus.on('newCreateMemo',()=>{
        showEditModal(null)
    });

    //组件卸载之前
    onBeforeUnmount(()=>{
        //停止监听新建便签事件
        bus.off('newCrteateMemo')
    })

    //创建待办事项
    const onCreateTodoThing = ()=>{
        return {
            checked:false,//是否已完成
            ting:''//待办事项
        }
    }

    //编辑便签表单值
    const formValue = ref({
        id:null,//便签编号
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

    //该便签用户编号
    const userId = ref(null);
    const memoId = computed(()=>formValue.id);

    //保存按钮是否需要禁用
    const saveBtnDisabled = ref(false);

    //新增便签的保存 修改便签的保存
    const saveUpdateMemo = async(isNewCreate)=>{
        //禁用保存按钮
        disabledBtn(saveBtnDisabled,true);

        console.log("save memo:",formValue.value);
        //请求参数
        const memoId = formValue.value.id //只有修改的时候使用
        const title = formValue.value.title
        const tags = formValue.value.tags.join()
        const content = JSON.stringify(formValue.value.content) //[{},{}] => '[{},{}]'
        const finished = formValue.value.finished
        const top = formValue.value.top? 1:0;

        console.log("top:",top);

        let API = {...memoApi.saveMemo};

        API.name = isNewCreate? API.name[1]:API.name[0];
        API.url = isNewCreate? API.url[1]:API.url[0];
        API.method = isNewCreate? API.method[1]:API.method[0];

        let formData = new FormData();
        formData.append("memoId",memoId);
        formData.append("title",title);
        formData.append("tags",tags);
        formData.append("content",content);
        formData.append("finished",finished);
        formData.append("top",top);

        API.data = formData;

        await noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            //关闭编辑便签窗口
            show.value = false
            //重新获取便签列表
            emits('save',false,false)
        })

        console.log("before call disabledBtn");
        //解除禁用按钮
        disabledBtn(saveBtnDisabled,false,true,2);
    }

    /**
     * 获取便签信息
     * @param {Integer} id 
     */
    const getMemoInfo = async (id) =>{
        //处于加载中
        loading.value = true;
        //
        let API = {...memoApi.getMemoInfo};
        API.params = {memoId:id}

        //
        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            const memoInfo = responseData.data
            userId.value = memoInfo.u_id;
            formValue.value.title = memoInfo.title
            formValue.value.top = !!memoInfo.top
            formValue.value.tags = memoInfo.tags.split(',')
            formValue.value.content = JSON.parse(memoInfo.content)
            loading.value = false
            //显示编辑便签的窗口
            show.value = true;
        })
    }

    let formNotification = null;

    //保存新增便签
    const saveNewAddMemo = async(e)=>{
        //销毁之前的通知
        if(formNotification) formNotification.destroy()
        //表单验证
        await formRef.value?.validate(errors=>{
            if(errors)
            {
                //所有验证出错消息对象
                const errorMessage = [].concat(...errors)
                formNotification = notification.error({
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
                throw "表单验证失败"
            }
        })

        saveUpdateMemo(formValue.value.id === null)
        console.log("after call saveUpdateMemo");
    }

    //是否处于加载中
    const loading = ref(true)

    /**
     * 显示便签编辑模态框
     * @param {Number} id 无值 新增 有值编辑
     */
    const showEditModal = (id)=>{
        if(id === null)
        {
            show.value = true
            //结束加载状态
            loading.value = false;
        }
        else
        {
            formValue.value.id = id
            //修改便签
            //发送请求 根据便签编号获取最新的便签信息
            getMemoInfo(id)
        }
    }

    //重置便签编辑框中内容
    const resetEditMemo =()=>{
        console.log("call reset edit memo");
        formValue.value.id = null
        formValue.value.title = '' //标题
        formValue.value.top = false //是否置顶
        formValue.value.tags=[] //标签
        formValue.value.content = [] //内容
    }
    
    //将哪些函数导出
    defineExpose({showEditModal,show,userId,memoId})
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