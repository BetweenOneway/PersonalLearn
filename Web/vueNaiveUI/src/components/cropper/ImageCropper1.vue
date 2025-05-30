<template>
    <div class="cropper-container">
    <cropper-canvas
        ref="cropperCanvas"
        :background="canvas.background"
        :disabled="canvas.disabled"
        :hidden="canvas.hidden"
        :scale-step="canvas.scaleStep"
        :theme-color="canvas.themeColor"
      >
        <cropper-image
          ref="cropperImage"
          :hidden="image.hidden"
          :rotatable="image.rotatable"
          :scalable="image.scalable"
          :skewable="image.skewable"
          :translatable="image.translatable"
          :initial-center-size="image.initialCenterSize"
          :src=imgUrl
          :alt="image.alt"
          @transform="onImageTransform"
        />
        <cropper-shade
          :hidden="shade.hidden"
          :theme-color="shade.themeColor"
        />
        <cropper-handle
          :action="handle.action"
          :hidden="handle.hidden"
          :plain="handle.plain"
          :theme-color="handle.themeColor"
        />
        <cropper-selection
          id="cropperSelection"
          ref="cropperSelection"
          :x="selection.x"
          :y="selection.y"
          :width="selection.width"
          :height="selection.height"
          :aspect-ratio="selection.aspectRatio"
          :initial-coverage="selection.initialCoverage"
          :hidden="selection.hidden"
          :initial-aspect-ratio="selection.initialAspectRatio"
          :movable="selection.movable"
          :resizable="selection.resizable"
          :zoomable="selection.zoomable"
          :multiple="selection.multiple"
          :keyboard="selection.keyboard"
          :outlined="selection.outlined"
          :precise="selection.precise"
          :dynamic="selection.dynamic"
          @change="onSelectionChange"
        >
          <cropper-grid
            :hidden="grid.hidden"
            :rows="grid.rows"
            :columns="grid.columns"
            :bordered="grid.bordered"
            :covered="grid.covered"
            :theme-color="grid.themeColor"
          />
          <cropper-crosshair
            :hidden="crosshair.hidden"
            :centered="crosshair.centered"
            :theme-color="crosshair.themeColor"
          />
          <cropper-handle
            v-for="subhandle in handles"
            :key="subhandle.action"
            :action="subhandle.action"
            :hidden="subhandle.hidden"
            :theme-color="subhandle.themeColor"
          />
        </cropper-selection>
      </cropper-canvas>
    </div>
</template>
    
<script setup>
    import { ref } from 'vue';
    import img from '@/assets/picture.jpg'

    let imgUrl = img;

    let canvas= ref({
        hidden: false,
        background: true,
        disabled: false,
        scaleStep: 0.1,
        themeColor: '#3399ff',
    });

    let image=ref({
        hidden: false,
        initialCenterSize: 'contain',
        rotatable: true,
        scalable: true,
        skewable: true,
        translatable: true,
        src: img,
        alt: 'The image to crop',
    })
    let shade = ref({
        themeColor: 'rgba(0, 0, 0, 0.65)',
      })
    let handle=ref({
        hidden: false,
        action: 'select',
        plain: true,
        themeColor: 'rgba(51, 153, 255, 0.5)',
    })
    let selection = ref({
        hidden: false,
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        aspectRatio: undefined,
        initialAspectRatio: undefined,
        initialCoverage: 0.5,
        dynamic: false,
        movable: true,
        resizable: true,
        zoomable: false,
        multiple: false,
        keyboard: false,
        outlined: false,
        precise: false,
    })

    let grid =  ref({
        hidden: false,
        rows: 3,
        columns: 3,
        bordered: true,
        covered: true,
        themeColor: 'rgba(238, 238, 238, 0.5)',
    })

    let crosshair = ref({
        hidden: false,
        centered: true,
        themeColor: 'rgba(238, 238, 238, 0.5)',
    })
    let handles=ref([
        {
          hidden: false,
          action: 'move',
          themeColor: 'rgba(255, 255, 255, 0.35)',
        },
        {
          hidden: false,
          action: 'n-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 'e-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 's-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 'w-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 'ne-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 'nw-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 'se-resize',
          themeColor: '#3399ff',
        },
        {
          hidden: false,
          action: 'sw-resize',
          themeColor: '#3399ff',
        },
      ]);
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
</style>