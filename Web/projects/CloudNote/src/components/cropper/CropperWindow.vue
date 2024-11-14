<template>
    <!--头像上传窗口-->
    <n-modal v-model:show="showCropper" preset="card" closable segmented title="头像上传" 
    width="800px" height="560px" content-style="height:0" :mask-closable="false" :close-on-sec="false">
        <template #default>
            <n-space justify="space-between" :wrap-item="false" style="height: 100%">
                <!--裁剪框元素-->
                <div style="height:100%;width:calc(100%-200px)">
                    <img id="image" :src="picSrc" style="max-height: 100%;max-width: 100%;">
                </div>
                
                <!--裁剪预览区域-->
                <n-space vertical justify="center" :size="24" :wrap-item="false" style="width:170px">
                    <n-sapce vertical align="center">
                        <div class="img-preview img-preview-120"></div>
                        <n-text>120*120</n-text>
                    </n-sapce>
                    <n-sapce vertical align="center">
                        <div class="img-preview img-preview-40"></div>
                        <n-text>40*40</n-text>
                    </n-sapce>
                    <n-sapce vertical align="center">
                        <div class="img-preview img-preview-36"></div>
                        <n-text>36*36</n-text>
                    </n-sapce>
                </n-space>
            </n-space>
        </template>
        
        
        <template #action>
            <n-space>
                <n-button @click="show=false">取消</n-button>
                <n-button>确定</n-button>
            </n-space>
        </template>
    </n-modal>    
</template>

<script setup>
    import {ref,nextTick} from 'vue'
    import "cropperjs/dist/cropper.css"
    import Cropper from 'cropperjs'

    let cropper = null

    const initCropper = ()=>{
        const image = document.getElementById('image');
        
        //
        cropper?.destroy();

        //创建Cropper实例
        cropper = new Cropper(image, {
            dragMode:'move',//拖拽模式
            viewMode:1,//视图模式
            aspectRatio:1,//长宽比
            autoCropArea:0.5,//裁剪框大小
            cropBoxResizable:false,//不允许更改裁剪框尺寸
            toggleDragModeOnDblclick:false,//禁用双击模式切换
            preview:'.img-preview',//裁剪框的预览
        })
    }

    //裁剪框窗口显示状态
    const showCropper = ref(false);

    //头像图片
    const picSrc = ref(null);

    //文件选择控件
    const fileInputRef = ref(null);

    const selectImageFile = (e)=>{
        //选中图像的重置
        picSrc.value = null;
        const {files} = e.target;
        if(!!files || !files.length) return;
        const file = files[0];
        const reader = new FileReader();
        //读取文件 base64
        reader.readAsDataURL(file);
        reader.onload = ()=>{
            //显示图像文件
            picSrc.value = String(reader.result)
            //显示头像上传窗口
            showCropper.value = true;
            //清除文件选择控件的值
            if(fileInputRef.value) fileInputRef.value.value = ''
            //视图更新完成后 初始化裁剪框
            nextTick(()=>{
                initCropper()
            })
        }
    }

    defineExpose({selectImageFile});
</script>

<style scoped>
    .cropper-view-box, .cropper-face {
        border-radius: 50%;
    }

    .img-preview{
        border:1px solid darkgray;
        border-radius: 50%;
        overflow:hidden;
    }

    .img-preview-120 {
        width:120px;
        height:120px;
    }

    .img-preview-40 {
        width:40px;
        height:40px;
    }

    .img-preview-36 {
        width:36px;
        height:36px;
    }
</style>