<template>
  <div class="basic_container">
    <div class="dialog_wrap">
      <div class="image_wrap" ref="imageWrap">
        <cropper-canvas ref="croppercanvas" background>
          <cropper-image
            :src="fileObj.fileShow"
            alt="Picture"
            ref="cropperimage"
            rotatable
            scalable
            skewable
            translatable
          ></cropper-image>
          <cropper-shade></cropper-shade>
          <cropper-handle action="move" plain></cropper-handle>
          <cropper-selection
            id="cropperSelection2"
            ref="cropperselection"
            movable
            resizable
            outlined
            aspectRatio="1"
            @change="onCropperSelectionChange"
          >
            <cropper-crosshair centered />
            <cropper-handle
              action="move"
              theme-color="rgba(255, 255, 255, 0.35)"
            />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
      </div>
      <div class="info_wrap">
        <div class="cropper_preview">
          <cropper-viewer
            selection="#cropperSelection2"
            style="width: 200px"
          ></cropper-viewer>
        </div>
        <div class="cropper_preview">
          <div>实际效果：img/canvas</div>
          <img :src="realShow" style="width: 200px" />
          <canvas ref="resultCanvas"></canvas>
        </div>
        <div class="btn_wrap">
          <input type="file" ref="input_form" @change="handleUploadSuccess" />
          <button type="primary" @click="handleConfirm">确 认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'cropperjs';
import { computed, nextTick, ref } from 'vue';

const fileObj = ref({});

const croppercanvas = ref();
const cropperimage = ref();
const cropperselection = ref();

/**
 * 监听选择区变化
 * @param event
 */
function onCropperSelectionChange(event) {
  // if (event.detail.width && event.detail.height) {
  //   isCropperSelection.value = true;
  // } else {
  //   isCropperSelection.value = false;
  // }
}

/**
 * 确认裁剪
 */
const emit = defineEmits(['success']);
const realShow = ref();
const resultCanvas = ref();
async function handleConfirm() {
  if (fileObj.value.fileShow) {
    const res = await cropperselection.value.$toCanvas();

    const dataImage = res.toDataURL('image/png');
    realShow.value = dataImage;
    const file = dataURLtoFile(dataImage, fileObj.value.name);
    emit('success', {
      ...fileObj.value,
      file: file,
      fileShow: dataImage,
    });
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

/**
 * 文件上传
 */
const input_form = ref();
async function handleUploadSuccess() {
  const files = input_form.value.files;

  if (files.length) {
    fileObj.value = {
      name: files[0].name,
      file: files[0],
      fileShow: URL.createObjectURL(files[0]),
    };
  }
  await nextTick();
  // const cropperCanvasRect = croppercanvas.value.getBoundingClientRect()
  // const cropperImageRect = cropperimage.value.getBoundingClientRect()
  // const x = cropperCanvasRect
  cropperselection.value.$change(0, 0, 100, 100);
  cropperselection.value.$center();
}
</script>

<style scoped>
.dialog_wrap {
  display: flex;
  .image_wrap {
    width: 400px;
    height: 300px;
    flex-shrink: 0;

    cropper-canvas {
      width: 100%;
      height: 100%;
    }
  }
  .info_wrap {
    margin-left: 20px;
  }
}
button {
  & + button {
    margin-left: 20px;
  }
}
button.active {
  background-color: #c6dff8;
  border-color: #409eff;
}
</style>
