<template>
    <n-drawer v-model:show="active" :width="400">
        <n-drawer-content closable title="用户基本信息">
            <n-space justify="center">
                <label>
                    <n-avatar round :size="120" :src="head_image"></n-avatar>
                    <input style="display:none" type="file" accept="image/jpeg,image/jpg,image/png,image/gif">
                </label>
            </n-space>

            <n-form label-placement="left" label-width="auto" style="margin-top:16px">
                <n-form-item label="邮箱：">
                    <n-text class="ml-3">{{email}}</n-text>
                </n-form-item>
                <n-form-item label="昵称：">
                    <n-input :value="userNickName" style="--n-border:none;--n-color:transparent"></n-input>
                </n-form-item>
                <n-form-item label="等级：">
                    <n-tag :bordered="false" class="ml-3" type="success">{{userLevel}}</n-tag>
                </n-form-item>
                <n-form-item label="邮箱：">
                    <n-text class="ml-3">{{time}}</n-text>
                </n-form-item>
                <n-form-item>
                    <n-button type="success" secondary block>更新</n-button>
                </n-form-item>
            </n-form>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
    import {ref} from 'vue'
    import { useUserStore } from "../../stores/userStore"

    const userStore = useUserStore()
    const {head_image,userNickName,userLevel,email,time} = storeToRefs(userStore)
    //是否激活抽屉
    const active = ref(true);
</script>

<style scoped>
    .n-avatar{
        box-shadow: 0 0 5px darkgray;
    }

    .ml-3 {
        margin-left:12px;
    }
</style>