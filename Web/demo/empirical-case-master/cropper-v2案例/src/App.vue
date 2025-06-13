<template>
  <div id="app">
    <div class="module_wrap">
      <h1 class="title">基本实现</h1>
      <div class="desc">提供功能性按钮，可以最大程度的调整图像</div>
      <basic @success="handleCropperSuccess" />
    </div>
    <div class="module_wrap">
      <h1 class="title">固定纵横比</h1>
      <div class="desc">纵横比，进入默认裁剪</div>
      <aspectRatio @success="handleCropperSuccess" />
    </div>
    <div class="module_wrap">
      <h1 class="title">圆形</h1>
      <div class="desc">圆形纵横比，进入默认裁剪</div>
      <MyCircle @success="handleCropperSuccess" />
    </div>
    <div class="module_wrap">
      <h1 class="title">钢笔</h1>
      <div class="desc">通过点击，形成一个不规则的闭合区域，自定义形状</div>
      <MyPan @success="handleCropperSuccess" />
    </div>
  </div>
</template>

<script setup>
import basic from './components/basic.vue';
import aspectRatio from './components/aspectRatio.vue';
import MyCircle from './components/circle.vue';
import MyPan from './components/pan.vue';

function handleCropperSuccess(e) {
  console.log('裁剪成功', e);
}
</script>

<style>
.module_wrap {
  border-bottom: 1px solid #ccc;
  padding: 20px 40px;
  margin-bottom: 20px;
  .title {
    font-size: 20px;
    line-height: 1;
  }
  .desc {
    font-size: 14px;
    color: #999;
    margin-bottom: 14px;
  }
}
</style>
