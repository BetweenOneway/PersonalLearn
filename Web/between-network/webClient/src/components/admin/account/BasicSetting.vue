<template>
    <n-grid x-gap="12" cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
        <n-grid-item>
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

            <n-space>
                <n-button v-show="updateFormItem" :disabled="!showUpdateBtn" type="success" @click="toUpdateBasicInfo">更新</n-button>
                <n-button v-bind="editBtnObj.props" type="success" ghost @click="clickEditBtn(!updateFormItem)">{{editBtnObj.text}}</n-button>
            </n-space>
        </n-grid-item>
        <n-grid-item>
            <!--用户头像-->
            <n-space justify="center">
                <label>
                    <n-avatar round :size="120" :src="head_image"></n-avatar>
                    <input ref="fileInputRef" :disabled="!updateFormItem" style="display:none" type="file" accept="image/jpeg,image/jpg,image/png,image/gif" @change="selectImageFile">
                </label>
            </n-space>

            <!--裁剪图像窗口-->
            <CropperWindow ref="cropperRef"  title="头像上传" @cut="uploadHeadPic"/>
        </n-grid-item>
    </n-grid>
</template>
  
<script setup>
    import {computed, ref,watch} from 'vue'
    import { useUserStore } from "@/stores/userStore"
    import {storeToRefs} from 'pinia'
    import noteServerRequest from "@/request"
    import userApi from '@/request/api/userApi'
    import CropperWindow from '@/components/cropper/CropperWindow.vue'
    
    const userStore = useUserStore()
    const {head_image,nickName,userNickName,userLevel,email,time,sex,birthday} = storeToRefs(userStore)
    const {setUserBasicInfo} = userStore;

    //表单组件实例对象
    const formRef = ref(null);

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

    const cropperRef = ref(null)

    //文件选择控件
    const fileInputRef = ref(null);

    const selectImageFile = (e)=>{
        console.log("Select Image file:",e.target);
        //选中图像的重置
        const {files} = e.target;
        console.log("files:",files);
        if(!files || !files.length) 
        {
            console.log(!!files);
            console.log(!files.length);
            console.log("no file selected");
            return;
        }
        const file = files[0];
        const reader = new FileReader();
        //读取文件 base64
        reader.readAsDataURL(file);
        reader.onload = ()=>{
            //显示图像文件
            const imgURL = String(reader.result)

            //清除文件选择控件的值
            if(fileInputRef.value) fileInputRef.value.value = ''
            //显示图像裁剪框
            cropperRef.value.showCropperWindow(imgURL);
        }
    }

    /**
     * 
     * @param {Blob} 裁剪对象数据
     * @param {String} 
     */
    const uploadHeadPic = ({blobData,dataURL})=>{
        let API = {...userApi.updateHeadPic}
        let formData = new FormData();
        formData.append("avatar",blobData,"avatar.png");

        console.log("get cropped data");
        
        API.data = formData;
        noteServerRequest(API).then(responseData=>{
            if(!responseData) return;
            //重置用户基本信息
            setUserBasicInfo(responseData.data);
            //
            cropperRef.value.showCropperWindow();
        })
    }
</script>