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
          <cropper-shade class="cropper_shade"></cropper-shade>
          <cropper-handle action="move" plain></cropper-handle>
          <cropper-selection
            id="cropperSelection3"
            ref="cropperselection"
            movable
            resizable
            outlined
            :aspectRatio="1"
            @change="onCropperSelectionChange"
          >
            <cropper-crosshair centered />
            <cropper-handle class="select_handle_move" action="move" />
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
            selection="#cropperSelection3"
            style="width: 200px"
          ></cropper-viewer>
        </div>
        <div class="cropper_preview">
          <div>实际效果：img/canvas</div>
          <img :src="realShow" style="width: 200px" />
          <canvas ref="circleCanvas"></canvas>
        </div>
        <div class="btn_wrap">
          <input type="file" ref="input_form" @change="handleUploadSuccess" />
          <button type="primary" @click="handleConfirm(false)">
            确认矩形图片
          </button>
          <button type="primary" @click="handleConfirm(true)">
            确认圆形图片
          </button>
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
const circleCanvas = ref();
async function handleConfirm(isCircle = false) {
  if (fileObj.value.fileShow) {
    const res = await cropperselection.value.$toCanvas();

    if (isCircle) {
      // 圆形图片
      // 创建一个新的canvas来处理圆形裁剪
      const circularCanvas = circleCanvas.value;
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
      const dataImage = circularCanvas.toDataURL('image/png');
      realShow.value = dataImage;
      const file = dataURLtoFile(dataImage, fileObj.value.name);
      emit('success', {
        ...fileObj.value,
        file: file,
        fileShow: dataImage,
      });
    } else {
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
  .cropper_shade {
    border-radius: 50%;
  }
  .select_handle_move {
    background-color: transparent;
  }
  cropper-viewer {
    border-radius: 50%;
  }
}
button {
  & + button {
    margin-left: 20px;
  }
}
</style>
