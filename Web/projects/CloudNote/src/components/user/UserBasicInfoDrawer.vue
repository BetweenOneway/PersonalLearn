<template>
    <n-drawer v-model:show="active" :width="400" @after-leave="updateFormItem = false">
        <n-drawer-content closable title="用户基本信息">
            <!--用户头像-->
            <n-space justify="center">
                <label>
                    <n-avatar round :size="120" :src="head_image"></n-avatar>
                    <input style="display:none" type="file" accept="image/jpeg,image/jpg,image/png,image/gif">
                </label>
            </n-space>

            <!--用户信息表单 邮箱，昵称 登记 注册时间 更新按钮-->
            <n-form ref="formRef" label-placement="left" label-width="auto" :show-require-mark="false" 
            :model="formValue" :rules="formRules" style="margin-top:16px">
                <n-form-item label="邮箱：">
                    <n-text >{{email}}</n-text>
                </n-form-item>
                <n-form-item label="昵称：" path="nickname">
                    <n-text v-if="!updateFormItem" v-bind="nickNameText.props">{{ nickNameText.text }}</n-text>
                    <n-input v-else v-model:value="formValue.nickname" maxlength="6" showcount></n-input>
                </n-form-item>
                <n-form-item label="性别：">
                    <n-text v-if="!updateFormItem">{{ !!formValue.sex?'男':'女' }}</n-text>
                    <n-radio-group v-else v-model:value="formValue.sex">
                        <n-space>
                            <n-radio :value="0">女</n-radio>
                            <n-radio :value="1">男</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="等级：">
                    <n-tag :bordered="false" :type="userLevel.theme">{{userLevel.text}}</n-tag>
                </n-form-item>
                <n-form-item label="出生日期：">
                    <n-text v-if="!updateFormItem" v-bind="birthdayText.props">{{ birthdayText.text }}</n-text>
                    <n-date-picker v-else type="date" 
                    v-model:formatted-value="formValue.birthday"
                    value-format="yyyy-MM-dd" :is-date-disabled="disablePreviousDate"></n-date-picker>
                </n-form-item>
                <n-form-item label="注册时间：">
                    <n-text >{{time}}</n-text>
                </n-form-item>
            </n-form>

            <template #footer>
                <n-space>
                    <n-button v-show="updateFormItem" :disabled="!showUpdateBtn" type="success" @click="toUpdateBasicInfo">更新</n-button>
                    <n-button v-bind="editBtnObj.props" type="success" ghost @click="clickEditBtn(!updateFormItem)">{{editBtnObj.text}}</n-button>
                </n-space>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
    import {computed, ref,watch} from 'vue'
    import { useUserStore } from "../../stores/userStore"
    import {storeToRefs} from 'pinia'
    import dayjs from 'dayjs'
    import noteServerRequest from "../../request"
    import userApi from '../../request/api/userApi'

    const userStore = useUserStore()
    const {head_image,nickName,userNickName,userLevel,email,time,sex,birthday} = storeToRefs(userStore)
    const {setUserBasicInfo} = userStore;

    //表单组件实例对象
    const formRef = ref(null);

    //是否激活抽屉
    const active = ref(false);

    /**
     * 改变激活状态
     * @param {Boolean} show 是否显示抽屉
     */
    const changeActive = async (show=true)=>{
        //等待获取用户的基本信息
        if(show)
        {
            await getUserBasicInfo();
            //设置控件值
            restoreFormValue();
        }
        //更改抽屉激活状态
        active.value = show;
    }

    //表单数据
    const formValue = ref({
        nickname:'',//昵称
        sex:0,//性别
        birthday:null,//出生日期
    });

    //表单验证规则
    const formRules ={
        nickname:[
            {
                required:true,
                message:'请输入昵称',
                trigger:['input','blur']
            },
            {
                trigger:['input','blur'],
                message:'昵称长度需在 2-20 个字符之间',
                validator:(rule,value)=>{
                    return !!value && value !=="" && value.length >= 2 && value.length <= 20;
                }
            }
        ]
    }

    //昵称显示的文本元素
    const nickNameText = computed(()=>{
        return formValue.value.nickname?
        {
            props:{depth:1},
            text:formValue.value.nickname
        }:
        {
            props:{depth:3},
            text:"暂未设置昵称"
        }
    });

    //生日显示的文本元素
    const birthdayText = computed(()=>{
        return formValue.value.birthday?
        {
            props:{depth:1},
            text:formValue.value.birthday
        }:
        {
            props:{depth:3},
            text:"暂未设置出生日期"
        }
    });

    //获取用户基本信息
    const getUserBasicInfo = ()=>{
        noteServerRequest(userApi.getBasicInfo).then(responseData=>{
            if(!responseData) throw "获取用户基本信息失败";
            const userData = responseData.data;
            setUserBasicInfo(userData);
        });
    }

    //表单编辑控件的显示
    const updateFormItem = ref(false);

    //重置表单值
    const restoreFormValue = ()=>{
        formValue.value.nickname = nickName.value;
        formValue.value.sex = sex.value;
        formValue.value.birthday = birthday.value
    }

    /**
     * 编辑/取消编辑按钮操作
     * @param edit 
     */
    const clickEditBtn = (edit=true)=>{
        //取消编辑 恢复表单值
        if(!edit)
        {
            restoreFormValue();
        }
        updateFormItem.value = edit;
    }

    //更新用户基本信息
    const toUpdateBasicInfo = async ()=>{
        await formRef.value?.validate();

        let API = {...userApi.updateUserInfo};

        API.data= {
            ...formValue.value
        }

        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            //关闭编辑状态
            updateFormItem.value = false;
            console.log("update user info response:",responseData.data);
            //重置用户信息
            setUserBasicInfo(responseData.data);
            //重置用户表单值
            restoreFormValue();
        })
    }

    //显示更新按钮的时机
    const showUpdateBtn = computed(()=>{
        const {nickname:nn,sex:s,birthday:b} = formValue.value;

        return (nn !== nickName.value || s !== sex.value|| b !== birthday.value)
         
    });

    //编辑按钮对象
    const editBtnObj = computed(()=>{
        return updateFormItem.value ?
        {
            text:'取消编辑',
            props:{
                type:'tertiary'
            }
        }:
        {
            text:'编辑',
            props:{
                type:'success'
            }
        };
    });

    //禁用将来日期
    const disablePreviousDate=(ts)=>{
        return ts > Date.now();
    };

    defineExpose({changeActive})
</script>

<style scoped>
    .n-avatar{
        box-shadow: 0 0 15px 5px darkgray;
    }
</style>