<template>
    <h3>ImageCropper-1</h3>
    <div style="display: flex" class="avatar">
        <div class="avatar-left">
            <div v-show="!imageOption.fileData">
                <n-upload 
                ref="upload"
                style="text-align: center;margin-bottom: 24px"
                :on-change="handleFileChange"
                accept="image/png, image/jpeg, image/jpg"
                :show-file-list="false"
                :default-upload="false"
                >
                    <n-button slot="trigger" size="small" type="primary" ref="uploadBtn">上传文件</n-button>
                </n-upload>
                <div>支持jpg、png格式的图片，大小不超过3M</div>
            </div>
            <div v-show="imageOption.fileData" >
                <div class="avatar-left-crop">
                <cropper-canvas ref="croppercanvas" background>
                    <!--width和initial-center-size有的带:，有的不带-->
                    <cropper-image ref="cropperimage" :src="imageOption.fileData" alt="Picture" 
                    :initial-center-size="imageOption.initialCenterSize"
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
                    @change="onCropperSelectionChange">
                        <!--选择框的表格-->
                        <cropper-grid role="grid" covered></cropper-grid>
                        <!--选择框的中间十字-->
                        <cropper-crosshair centered></cropper-crosshair>
                        <!--选择框的操作方式move 移动 select 支持自拉框-->
                        <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
                        <!--缩放选择框的组件 选择框上的点 缩放用-->
                        <!-- <cropper-handle action="n-resize"></cropper-handle>
                        <cropper-handle action="e-resize"></cropper-handle>
                        <cropper-handle action="s-resize"></cropper-handle>
                        <cropper-handle action="w-resize"></cropper-handle>
                        <cropper-handle action="ne-resize"></cropper-handle>
                        <cropper-handle action="nw-resize"></cropper-handle>
                        <cropper-handle action="se-resize"></cropper-handle>
                        <cropper-handle action="sw-resize"></cropper-handle> -->
                    </cropper-selection>
                </cropper-canvas>
                </div>
            </div>
        </div>
        <!--预览区-->
        <div class="avatar-right">
            <div v-if="imageOption.fileData">
                <cropper-viewer selection="#cropperSelection" v-for="item in previewsDiv" :style="item.style"
                class="avatar-right-previews"/>
            </div>
            <div v-else class="avatar-right-div" v-for="item in previewsDiv" :style="item.style">
            </div>

            <!-- <div class="avatar-right-div" v-for="item in previewsDiv" :style="item.style">
                <div v-show="imageOption.fileData" class="avatar-right-previews" >
                    <cropper-viewer selection="#cropperSelection"/>
                </div>
            </div> -->
            <div class="avatar-right-text">
                <n-button-group v-if="imageOption.fileData" size="small">
                    <n-button ghost @click="ChangePicture">
                        重新选择
                    </n-button>
                    <n-button ghost @click="UploadPreviews(true)">
                        确定
                    </n-button>
                </n-button-group>
                <span v-else>预览</span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import 'cropperjs';
    import { ref } from 'vue';
    import { useMessage } from "naive-ui";

    const imageOption = ref({
        src:"",
        fileName:"",
        fileData:"",
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
        resizable: false,
        zoomable: false,
        multiple: false,
        keyboard: false,
        outlined: true,
        precise: false,
    })

    const message = useMessage()

    //实时预览图样式
    let previewsDiv = ref([
        //108px 预览样式
        {
            style: {
                width: '108px',
                height: '108px',
                margin: '0 auto'
            },
            zoomStyle: {
                zoom: 0.54
            }
        },
        //68px 预览样式
        {
            style: {
                width: '68px',
                height: '68px',
                margin: '27px auto'
            },
            zoomStyle: {
                zoom: 0.34
            }
        },
        //48px 预览样式
        {
            style: {
                width: '48px',
                height: '48px',
                margin: '0 auto'
            },
            zoomStyle: {
                zoom: 0.24
            }
        }
    ]);

    const croppercanvas = ref();
    const cropperimage = ref();
    const cropperselection = ref();

    function handleFileChange(fileList) 
    {
        const file = fileList.fileList[0];
        //console.log("file=>",file);
        console.log("file.file=>",file.file);
        const isIMAGE = file.file.type === 'image/jpeg' || file.file.type === 'image/png';
        const isLt3M = file.file.size / 1024 / 1024 < 3;
        if (!isIMAGE) {
            message.error('请选择 jpg、png 格式的图片！',{
                closable: true
            })
            return false;
        }
        if (!isLt3M) {
            message.error('上传图片大小不能超过 3MB',{
                closable: true
            })
          return false;
        }
        imageOption.value.fileType = file.file.type;
        imageOption.value.fileName = file.file.name;
        imageOption.value.fileData = URL.createObjectURL(file.file);

        console.log("imageOption=>",imageOption.value);
    }
      
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

    // 将data:image转成新的file
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const file = new File([blob], filename, { type: mime });
        return file;
    }

    //确认
    async function UploadPreviews(isCircle=false) {
        console.log("Upload preview");

        const res = await cropperselection.value.$toCanvas();

        if (isCircle) {
            // 圆形图片
            // 创建一个新的canvas来处理圆形裁剪
            const circularCanvas = document.createElement('canvas');;
            const context = circularCanvas.getContext('2d');
            // 设置canvas的宽高与裁剪区域相同
            const size = Math.min(res.width, res.height); // 确保是正方形
            circularCanvas.width = size;
            circularCanvas.height = size;
            // 绘制圆形裁剪区域
            context.beginPath();
            context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); // 在中心绘制圆形
            context.closePath();
            context.clip(); // 剪切区域
            // 在圆形剪切区域内绘制图片
            context.drawImage(res, 0, 0, size, size);
            // 导出圆形图片数据
            const dataImage = circularCanvas.toDataURL(imageOption.value.fileType);
            console.log("confirm circle dataImage=>",dataImage);
        }
        else{
            const dataImage = res.toDataURL(imageOption.value.fileType);
            const file = dataURLtoFile(dataImage, "Cropper-file");
            console.log("confirm square dataImage=>",dataImage);
        }
    }

    function ChangePicture()
    {
        imageOption.value.fileData="";
    }

</script>

<style scoped>
    /**必备 */
    cropper-canvas {
      width: 100%;
      height: 100%;
    }

    .avatar {
        display: flex;
    }
    .avatar .avatar-left {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 400px;
        height: 400px;
        background-color: #F0F2F5;
        margin-right: 10px;
        border-radius: 4px;
    }
    .avatar .avatar-left .avatar-left-crop {
        width: 400px;
        height: 400px;
        position: relative;
    }
    .avatar .avatar-left .avatar-left-crop .crop-box {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
    }
    .avatar .avatar-left .avatar-left-p {
        text-align: center;
        width: 100%;
        position: absolute;
        bottom: 20px;
        color: #ffffff;
        font-size: 14px;
    }
    .avatar .avatar-right {
        width: 150px;
        height: 400px;
        background-color: #F0F2F5;
        border-radius: 4px;
        padding: 16px 0;
        box-sizing: border-box;
    }
    .avatar .avatar-right .avatar-right-div {
        border: 3px solid #ffffff;
        border-radius: 50%;
    }

    cropper-viewer {
        border-radius: 50%;
    }

    .avatar .avatar-right .avatar-right-text {
        text-align: center;
        margin-top: 50px;
        font-size: 14px;
    }
    .avatar .avatar-right .avatar-right-text span {
        color: #666666;
    }

    img{
        max-width: none;
    }
</style>