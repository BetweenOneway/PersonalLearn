<template>
    <!--头像上传窗口-->
    <n-modal v-model:show="showCropper" preset="card" closable segmented  
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
            <n-space justify="center" :size="60">
                <!--功能按钮-->
                <n-button-group>
                    <!--放大-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.zoom(0.1)">
                                <template #icon>
                                    <n-icon :component="ZoomInRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        放大
                    </n-tooltip>
                    <!--缩小-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.zoom(-0.1)">
                                <template #icon>
                                    <n-icon :component="ZoomOutRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        缩小
                    </n-tooltip>
                    <!--顺时针旋转-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.rotate(45)">
                                <template #icon>
                                    <n-icon :component="RotateRightRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        顺时针旋转
                    </n-tooltip>
                    <!--逆时针旋转-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.rotate(-45)">
                                <template #icon>
                                    <n-icon :component="RotateLeftRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        逆时针旋转
                    </n-tooltip>
                    <!--上下翻转-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.scaleY(sacleYFactor=-sacleYFactor)">
                                <template #icon>
                                    <n-icon :component="SwapVertRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        上下翻转
                    </n-tooltip>
                    <!--左右翻转-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.scaleX(sacleXFactor = -sacleXFactor)">
                                <template #icon>
                                    <n-icon :component="SwapHorizRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        左右翻转
                    </n-tooltip>
                    <!--重置-->
                    <n-tooltip>
                        <template #trigger>
                            <n-button circle @click="cropper.reset()">
                                <template #icon>
                                    <n-icon :component="AutorenewRound"></n-icon>
                                </template>
                            </n-button>
                        </template>
                        重置
                    </n-tooltip>
                </n-button-group>
                <!--确定，取消-->
                <n-button-group>
                    <n-button @click="show=false">取消</n-button>
                    <n-button @click="getCropperCanvas">
                        <template #icon>
                            <n-icon :component="ContentCutRound"></n-icon>
                        </template>
                        确定
                    </n-button>
                </n-button-group>
            </n-space>
        </template>
    </n-modal>    
</template>

<script setup>
    import {ref,nextTick} from 'vue'
    import {ZoomInRound,ZoomOutRound,RotateRightRound,RotateLeftRound
        ,SwapVertRound,SwapHorizRound,AutorenewRound,
        ContentCutRound
    } from'@vicons/material'
    import "cropperjs/dist/cropper.css"
    import Cropper from 'cropperjs'

    let cropper = null;

    let resultData = {
        blobData:null,
        dataURL:null,
    }

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

    /**
     * 显示裁剪窗口
     * @param imgURL 图像base64地址
     */
    const showCropperWindow = (imgURL)=>{
        resultData.blobData = null;
        resultData.dataURL = null;

        //选中图像的重置
        picSrc.value = imgURL;
        //显示头像上传窗口
        showCropper.value = true;

        nextTick(()=>{
            initCropper()
        })
    }
    /**
     * 获取裁剪区域画布数据
     */
    const getCropperCanvas=()=>{
        let cropperCanvas = cropper.getCropperCanvas({
            width:120,
            height:120,
        });
        cropperCanvas.toBlob(blob=>{
            resultData.blobData = blob;
        })
        //转成Base64图像
        resultData.dataURL = cropperCanvas.toDataURL('img/png');
    }

    /**
     * 获取裁剪结果
     */
    const getResultData = ()=>{
        return resultData;
    }

    //翻转因子
    let sacleXFactor = 1,sacleYFactor=1;
    defineExpose({showCropperWindow,getResultData});
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