<template>
    <div class="cropper-container">
        <cropper-canvas
        v-if="ready"
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
            :src="image.src"
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
    <!--预览-->
    <div class="previews clearfix">
        <h6>Preview</h6>
        <cropper-viewer
          v-if="ready"
          class="preview preview-lg"
          selection="#cropperSelection"
        />
        <cropper-viewer
          v-if="ready"
          class="preview preview-md"
          selection="#cropperSelection"
        />
        <cropper-viewer
          v-if="ready"
          class="preview preview-sm"
          selection="#cropperSelection"
        />
        <cropper-viewer
          v-if="ready"
          class="preview preview-xs"
          selection="#cropperSelection"
        />
    </div>
</template>
  
<script setup>
    import 'cropperjs';
    import { ref } from 'vue';

    import img from '@/assets/picture.jpg'

    let ready = ref(true);
    const canvas = ref( {
        hidden: false,
        background: true,
        disabled: false,
        scaleStep: 0.1,
        themeColor: '#3399ff',
    });
    
    const image = ref({
        hidden: false,
        initialCenterSize: 'contain',
        rotatable: true,
        scalable: true,
        skewable: true,
        translatable: true,
        src: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4',
        alt: 'The image to crop',
    })

    const shade = ref({
        themeColor: 'rgba(0, 0, 0, 0.65)',
    })

    const handle =ref( {
        hidden: false,
        action: 'select',
        plain: true,
        themeColor: 'rgba(51, 153, 255, 0.5)',
    })

    const selection = ref({
        hidden: false,
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        aspectRatio: 1,
        initialAspectRatio: 1,
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
    const grid = ref({
        hidden: false,
        rows: 3,
        columns: 3,
        bordered: true,
        covered: true,
        themeColor: 'rgba(238, 238, 238, 0.5)',
      })
    const crosshair=ref({
        hidden: false,
        centered: true,
        themeColor: 'rgba(238, 238, 238, 0.5)',
    })
    let handles = ref([
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
      ])
</script>
  
<style scoped>
  .cropper-container {
    max-width: 1200px;
    height:20rem;
    margin: 0 auto;
    padding: 20px;
  }
  
    cropper-canvas {
        height: 100%;
    }

  .previews {
    margin-bottom: 0;
    margin-right: -1rem;
  }

  .preview {
    float: left;
    margin-bottom: 1rem;
    margin-right: 1rem;
  }

  .preview-lg {
    height: 200px;
    width: 200px;
  }

  .preview-md {
    height: 100px;
    width: 100px;
  }

  .preview-sm {
    height: 50px;
    width: 50px;
  }

  .preview-xs {
    height: 30px;
    width: 30px
  }
  
  </style>  