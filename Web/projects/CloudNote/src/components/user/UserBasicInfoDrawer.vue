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
                    <n-input v-model:value="fromValue.nickname" style="--n-border:none;--n-color:transparent"></n-input>
                </n-form-item>
                <n-form-item label="等级：">
                    <n-tag :bordered="false" class="ml-3" type="success">{{userLevel}}</n-tag>
                </n-form-item>
                <n-form-item label="邮箱：">
                    <n-text class="ml-3">{{time}}</n-text>
                </n-form-item>
                <n-form-item v-show="formValue.nickName !== userNickName">
                    <n-button type="success" secondary block @click="toUpdateBasicInfo">更新</n-button>
                </n-form-item>
            </n-form>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
    import {ref} from 'vue'
    import { useUserStore } from "../../stores/userStore"
    import { watch } from 'vue';

    const userStore = useUserStore()
    const {head_image,userNickName,userLevel,email,time} = storeToRefs(userStore)

    //表单组件实例对象
    const formRef = ref(null);

    //是否激活抽屉
    const active = ref(false);

    /**
     * 改变激活状态
     * @param {Boolean} show 是否显示抽屉
     */
    const changeActive = (show=true)=>{
        active.value = show;
    }

    //表单数据
    const formValue = ref({
        nickname:'',//昵称
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
            }
        }
    )

    //更新用户基本信息
    const toUpdateBasicInfo = ()=>{
        formRef.value?.validate();
    }

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