<template>
    <!--头像上传窗口-->
    <n-modal v-model:show="showCropper" preset="card" closable segmented  
    style="width:800px;height:560px" content-style="height:0" :mask-closable="false" :close-on-sec="false">
        <template #default>
            <n-space justify="space-between" :wrap-item="false" style="height: 100%">
                <!--裁剪框元素-->
                <div style="height:100%;width:calc(100% - 200px)">
                    <cropper-canvas ref="croppercanvas" background>
                        <!--width和initial-center-size有的带:，有的不带-->
                        <cropper-image ref="cropperimage" :src="imageOption.src" 
                        alt="Picture" 
                        rotatable scalable skewable translatable></cropper-image>
                        <!--选择区域与其他区域的明暗对比-->
                        <cropper-shade hidden></cropper-shade>
                        <!--背景图片的操作方式 如果不希望背景图乱动或者有一个选区后无法重新选择 这个要删除掉-->
                        <!-- <cropper-handle action="select" plain></cropper-handle> -->
                        <!---->
                        <cropper-selection 
                        id="cropperSelection" 
                        ref="cropperselection"
                        :width="selectionOption.width" :height="selectionOption.height" 
                        :movable="selectionOption.movable"
                        :outlined="selectionOption.outlined"
                        :resizable="selectionOption.resizable"
                        :aspectRatio="selectionOption.aspectRatio"
                        @change="onCropperSelectionChange">
                            <!--选择框的中间十字-->
                            <cropper-crosshair centered></cropper-crosshair>
                            <!--选择框的操作方式move 移动 select 支持自拉框-->
                            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
                            <!--缩放选择框的组件 选择框上的点 缩放用-->
                            <cropper-handle action="n-resize"></cropper-handle>
                            <cropper-handle action="e-resize"></cropper-handle>
                            <cropper-handle action="s-resize"></cropper-handle>
                            <cropper-handle action="w-resize"></cropper-handle>
                            <cropper-handle action="ne-resize"></cropper-handle>
                            <cropper-handle action="nw-resize"></cropper-handle>
                            <cropper-handle action="se-resize"></cropper-handle>
                            <cropper-handle action="sw-resize"></cropper-handle>
                        </cropper-selection>
                    </cropper-canvas>
                </div>
                
                <!--裁剪预览区域-->
                <n-space vertical justify="center" :wrap-item="false" style="width:170px">
                    <n-space vertical align="center" v-for="item in previewsDiv">
                        <cropper-viewer selection="#cropperSelection" :style="item.style" class="img-preview"></cropper-viewer>
                        <n-text>{{ item.text }}</n-text>
                    </n-space>
                </n-space>
            </n-space>
        </template>
        
        <template #action>
            <n-space justify="center" :size="60">
                <!--确定，取消-->
                <n-button-group>
                    <n-button @click="showCropper=false">取消</n-button>
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

    import 'cropperjs';

    const imageOption = ref({
        src:"",
        initialCenterSize:"cover",//cover contain
    })

    const selectionOption = ref({
        hidden: false,
        x: undefined,
        y: undefined,
        width: 100,
        height: 100,
        aspectRatio: 1,
        initialAspectRatio: 1,
        initialCoverage: 0.5,
        dynamic: false,
        movable: true,
        resizable: true,
        zoomable: false,
        multiple: false,
        keyboard: false,
        outlined: true,
        precise: false,
    })

    //实时预览图样式
    let previewsDiv = ref([
        //120px 预览样式
        {
            style: {
                width: '120px',
                height: '120px',
                margin: '0 auto'
            },
            text:"120*120"
        },
        //40px 预览样式
        {
            style: {
                width: '40px',
                height: '40px',
                margin: '0 auto'
            },
            text:"40*40"
        },
        //36px 预览样式
        {
            style: {
                width: '36px',
                height: '36px',
                margin: '0 auto'
            },
            text:"36*36"
        }
    ]);
    //自定义事件
    const emits = defineEmits(['cut'])

    let cropper = null;

    let resultData = {
        blobData:null,
        dataURL:null,
    }

    //裁剪框窗口显示状态
    const showCropper = ref(false);

    const croppercanvas = ref();
    const cropperimage = ref();
    const cropperselection = ref();

    function inSelection(selection, maxSelection) {
      return (
        selection.x >= maxSelection.x
        && selection.y >= maxSelection.y
        && (selection.x + selection.width) <= (maxSelection.x + maxSelection.width)
        && (selection.y + selection.height) <= (maxSelection.y + maxSelection.height)
      );
    }

    function onCropperSelectionChange(event) {
        if (!croppercanvas.value) {
            return;
        }

        const selection = event.detail;
        const cropperCanvasRect = croppercanvas.value.getBoundingClientRect();

        let type = 0;//0--canvas 1--image
        let maxSelection = {};
        if(type == 0)
        {
            maxSelection = {
                x: 0,
                y: 0,
                width: cropperCanvasRect.width,
                height: cropperCanvasRect.height,
            };
        }
        else if(type == 1)
        {
            const cropperImageRect = cropperimage.value.getBoundingClientRect();
            maxSelection = {
                x: cropperImageRect.left - cropperCanvasRect.left,
                y: cropperImageRect.top - cropperCanvasRect.top,
                width: cropperImageRect.width,
                height: cropperImageRect.height,
            };
        }

        if (!inSelection(selection, maxSelection)) {
            event.preventDefault();
        }
    }

    /**
     * 显示裁剪窗口
     * @param imgURL 图像base64地址
     */
    const showCropperWindow = (imgURL)=>{
        console.log("Call show cropper window:",imgURL)
        if(!imgURL) 
        {
            //关闭窗口
            showCropper.value = false;
            return;
        }
        resultData.blobData = null;
        resultData.dataURL = null;

        //选中图像的重置
        imageOption.value.src = imgURL;
        //显示头像上传窗口
        showCropper.value = true;
    }
    
    /**
     * 获取裁剪区域画布数据
     */
     async function getCropperCanvas()
     {
        console.log("get cropper canvas");
        const res = await cropperselection.value.$toCanvas({
            width:120,
            height:120,
        });

        //转成Base64图像
        resultData.dataURL = res.toDataURL('img/png');

        res.toBlob(blob=>{
            resultData.blobData = blob;
            //通知父组件 裁剪成功
            emits('cut',resultData);
        })
    }

    /**
     * 获取裁剪结果
     */
    const getResultData = ()=>{
        return resultData;
    }

    defineExpose({showCropperWindow,getResultData});
</script>

<style scoped>
    cropper-canvas {
        width: 100%;
        height: 100%;
    }

    .img-preview{
        border:1px solid darkgray;
        border-radius: 50%;
        overflow:hidden;
    }
</style>