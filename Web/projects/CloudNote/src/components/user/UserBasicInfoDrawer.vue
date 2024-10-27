<template>
    <n-drawer v-model:show="active" :width="400">
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
                    <n-text class="ml-3">{{email}}</n-text>
                </n-form-item>
                <n-form-item label="昵称：" path="nickname">
                    <n-input v-model:value="formValue.nickname" style="--n-border:none;--n-color:transparent"></n-input>
                </n-form-item>
                <n-form-item label="性别：">
                    <n-radio-group class="ml-3" v-model:value="formValue.sex">
                        <n-space>
                            <n-radio :value="0">女</n-radio>
                            <n-radio :value="1">男</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="出生日期：">
                    <n-date-picker class="ml-3" type="date" 
                    v-model:formatted-value="formValue.birthday"
                    value-format="yyyy-MM-dd HH:mm:ss"></n-date-picker>
                </n-form-item>
                <n-form-item label="等级：">
                    <n-tag :bordered="false" class="ml-3" type="success">{{userLevel}}</n-tag>
                </n-form-item>
                <n-form-item label="邮箱：">
                    <n-text class="ml-3">{{time}}</n-text>
                </n-form-item>
                <n-form-item v-show="showUpdateBtn">
                    <n-button type="success" secondary block @click="toUpdateBasicInfo">更新</n-button>
                </n-form-item>
            </n-form>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
    import {ref,watch} from 'vue'
    import { useUserStore } from "../../stores/userStore"
    import {storeToRefs} from 'pinia'
    import noteServerRequest from "../../request"
    import userApi from '../../request/api/userApi'

    const userStore = useUserStore()
    const {head_image,userNickName,userLevel,email,time,sex,birthday} = storeToRefs(userStore)
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
        nickname:{
            required:true,
            message:'请输入昵称',
            trigger:['input','blur']
        }
    }

    watch(
        ()=>active.vlaue,
        newData=>{
            if(newData){
                formValue.value.nickname = userNickName.value;
                formValue.value.sex = sex.value;
                formValue.value.birthday = birthday.value
            }
        }
    )

    //获取用户基本信息
    const getUserBasicInfo = ()=>{
        noteServerRequest(userApi.getBasicInfo).then(responseData=>{
            if(!responseData) throw "获取用户基本信息失败";
            const userData = responseData.data;
            setUserBasicInfo(userData);
        });
    }

    //更新用户基本信息
    const toUpdateBasicInfo = ()=>{
        formRef.value?.validate();
    }

    //显示更新按钮的时机
    const showUpdateBtn = computed(()=>{
        const {nickname:nn,sex:s,birthday:b} = formValue.value;

        return (nn !== userNickName.value || s !== sex.value|| b !== birthday.value)
         
    });

    defineExpose({changeActive})
</script>

<style scoped>
    .n-avatar{
        box-shadow: 0 0 5px darkgray;
    }

    .ml-3 {
        margin-left:12px;
    }
</style>