<template>
    <div class="vue-container">
        <vueCropper
        ref="cropper"
        v-bind="option"
        @realTime = "realTime"
        ></vueCropper>
    </div>

    <div class="pre">
        <section class="pre-item">
            <p>截图框大小</p>
            <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden',
                'margin': '5px'}">
                <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img" alt=""/>
                </div>
            </div>
        </section>

        <section class="pre-item">
            <p>中等大小</p>
            <div :style="previewStyle1"> 
                <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </section>

        <section class="pre-item">
            <p>迷你大小</p>
            <div :style="previewStyle2"> 
                <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </section>

        <section class="pre-item" title="zoom: (100 / previews.w)">
            <p>固定为100宽度</p>
            <div :style="previewStyle3"> 
                <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </section>

        <section class="pre-item" title="zoom: (100 / previews.h)">
            <p>固定为100高度</p>
            <div :style="previewStyle4">
                <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </section>
    </div>
    
</template>

<script setup>
    import 'vue-cropper/dist/index.css'
    import { VueCropper }  from "vue-cropper";
    import { ref } from 'vue';

    let option = ref({
        img: "https://avatars2.githubusercontent.com/u/15681693?s=460&v=4", //裁剪图片的地址
        mode:"cover",//图片默认渲染方式
        outputSize: 1,//裁剪生成图片的质量
        full: false,//是否输出原图比例的截图
        outputType: "png",//裁剪生成图片的格式
        autoCrop:true,//是否默认生成截图框
        fixedBox: true,//固定截图框大小
        centerBox:true,//截图框是否被限制在图片里面
        autoCropWidth: 200,//默认生成截图框宽度
        autoCropHeight: 200,
        fixed: true,//是否开启截图框宽高固定比例
        fixedNumber: [1, 1],//截图框的宽高比例
        original:true,
    });

    let previews = ref({});
    let previewStyle1 = ref({});
    let previewStyle2 = ref({});
    let previewStyle3 = ref({});
    let previewStyle4 = ref({});

    function realTime(data) {
        var previewsData = data
        var h = 0.5
        var w = 0.2

        previewStyle1.value = {
            width: previewsData.w + "px",
            height: previewsData.h + "px",
            overflow: "hidden",
            margin: "0",
            zoom: h
        }

        previewStyle2.value = {
            width: previewsData.w + "px",
            height: previewsData.h + "px",
            overflow: "hidden",
            margin: "0",
            zoom: w
        }

        // 固定为 100 宽度
        previewStyle3.value = {
            width: previewsData.w + "px",
            height: previewsData.h + "px",
            overflow: "hidden",
            margin: "0",
            zoom: 100 / previewsData.w
        }

        // 固定为 100 高度
        previewStyle4.value = {
            width: previewsData.w + "px",
            height: previewsData.h + "px",
            overflow: "hidden",
            margin: "0",
            zoom: (100 / previewsData.h)
        }
        previews.value = data
    }

</script>

<style scoped>
.vue-container{
    width: 500px;
    height: 500px;
}

.pre {
	display: flex;
  flex-wrap: wrap;
}

.pre-item {
	padding-right: 20px;
}
</style>