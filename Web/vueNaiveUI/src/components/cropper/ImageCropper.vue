<template>
    <div class="avatar">
        <div class="cropper-container">
            <cropper-canvas ref="croppercanvas" background>
                <!--width和initial-center-size有的带:，有的不带-->
                <cropper-image ref="cropperimage" :src="imageOption.src" alt="Picture" 
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
                :width="selectionOption.width" :height="selectionOption.height" :movable="selectionOption.movable"
                :outlined="selectionOption.outlined"
                :resizable="selectionOption.resizable">
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
        <div class="preview-container">
            <cropper-viewer
            class="preview preview-lg"
            selection="#cropperSelection"
            />
            <cropper-viewer
            class="preview preview-md"
            selection="#cropperSelection"
            />
            <cropper-viewer
            class="preview preview-sm"
            selection="#cropperSelection"
            />
        </div>
        <button type="primary" @click="handleConfirm">确 认</button>
    </div>
</template>
    
<script setup>
    import 'cropperjs';
    import { ref } from 'vue';
    import img from '@/assets/picture.jpg'

    let imgUrl = img
    console.log(imgUrl)

    const croppercanvas = ref();
    const cropperimage = ref();
    const cropperselection = ref();
    
    const imageOption = ref({
        src:"https://avatars2.githubusercontent.com/u/15681693?s=460&v=4",
        initialCenterSize:"cover"
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
    
    function inSelection(selection, maxSelection) {
      return (
        selection.x >= maxSelection.x
        && selection.y >= maxSelection.y
        && (selection.x + selection.width) <= (maxSelection.x + maxSelection.width)
        && (selection.y + selection.height) <= (maxSelection.y + maxSelection.height)
      );
    }

    function onCropperSelectionChange(event) {
        return;
        if (!croppercanvas.value) {
            return;
        }

        const cropperCanvasRect = croppercanvas.value.getBoundingClientRect();
        const selection = event.detail;
        const cropperImageRect = cropperimage.value.getBoundingClientRect();
        const maxSelection = {
            x: cropperImageRect.left - cropperCanvasRect.left,
            y: cropperImageRect.top - cropperCanvasRect.top,
            width: cropperImageRect.width,
            height: cropperImageRect.height,
        };

        if (!inSelection(selection, maxSelection)) {
            //event.preventDefault();
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

    const emit = defineEmits(['success']);
    async function handleConfirm() {

        const res = await cropperselection.value.$toCanvas();

        const dataImage = res.toDataURL('image/png');
        const file = dataURLtoFile(dataImage, fileObj.value.name);
        emit('success', {
            ...fileObj.value,
            file: file,
            fileShow: dataImage,
        });
    }
</script>

<style scoped>
    .cropper-container {
        border: 1px solid ;
        width: 400px;
        height: 300px;
    }

    cropper-canvas {
      width: 100%;
      height: 100%;
    }

    .preview-container
    {
        display:flex;
    }
    .preview-lg {
        height: 108px;
        width: 108px;
        border-radius: 50%;
    }

    .preview-md {
        height: 68px;
        width: 68px;
    }

    .preview-sm {
        height: 48px;
        width: 48px;
    }
</style>