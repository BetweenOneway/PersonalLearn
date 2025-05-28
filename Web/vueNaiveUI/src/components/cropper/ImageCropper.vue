<template>
    <div class=".cropper-container">
        <cropper-canvas ref="croppercanvas" background>
            <cropper-image ref="cropperimage" :src=imgUrl alt="Picture" rotatable scalable skewable translatable></cropper-image>
            <!--选择区域与其他区域的明暗对比-->
            <cropper-shade hidden></cropper-shade>
            <!--move 移动 select 支持自拉框-->
            <cropper-handle action="move" plain></cropper-handle>
            <cropper-selection ref="cropperselection" initial-coverage="0.5" movable resizable outlined
            @change="onCropperSelectionChange">
                <!--选择框的表格-->
                <cropper-grid role="grid" covered></cropper-grid>
                <!--选择框的中间十字-->
                <cropper-crosshair centered></cropper-crosshair>
                <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
                <!--缩放选择框的组件-->
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
            event.preventDefault();
        }
    }
</script>

<style scoped>

body{
    min-width: 320px;
}
.cropper-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;

}

cropper-canvas{
    height:320px;
    min-width: 500px;
}

</style>