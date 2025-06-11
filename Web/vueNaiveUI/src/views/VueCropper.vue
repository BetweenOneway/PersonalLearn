<template>
    <div style="display: flex" class="avatar">
        <div class="avatar-left">
            <div v-show="!options.img">
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
            <div v-show="options.img" class="avatar-left-crop">
                <vue-cropper ref="cropper" v-bind="options" @realTime="realTime"></vue-cropper>
            </div>
        </div>
        <!--预览区-->
        <div class="avatar-right">
            <!-- <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
                <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div> -->
            <div class="avatar-right-div" v-for="item in previewsDiv" :style="item.style">
                <div v-show="options.img" :class="previews.div" class="avatar-right-previews" :style="item.zoomStyle">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
            <div class="avatar-right-text">
                <n-button v-if="options.img" type="text" @click="uploadPreviews">重新上传</n-button>
                <span v-else>预览</span>
            </div>
        </div>
    </div>
</template>

<script setup>
    // import 'vue-cropper/dist/index.css'
    // import vueCropper from 'vue-cropper/lib/vue-cropper.vue';
    import 'vue-cropper/dist/index.css'
    import { VueCropper }  from "vue-cropper";
    import { ref } from 'vue';
    import { useMessage } from "naive-ui";

    const message = useMessage()

    let options = ref({
        img: "",
        mode:"cover",
        size: 1,
        full: false,
        outputType: "png",
        autoCrop:true,
        fixedBox: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixed: true,
        fixedNumber: [1, 1],
    });

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

    let previews = ref({});

    function handleFileChange(fileList) 
    {
        const file = fileList.fileList[0];
        console.log("file=>",file);
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
        let reader = new FileReader();
        reader.readAsDataURL(file.file);
        reader.onload = e => {
            options.value.img = e.target.result //base64
        }
    }
      
    function realTime(data) {
        console.log("realTime=>data",data);
        previews.value = data
    }

    const uploadBtn = ref();
    function uploadPreviews() {
        console.log("uploadBtn.value=>",uploadBtn.value);
        uploadBtn.value.$el.click()
    }

</script>

<style scoped>
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
    .avatar .avatar-right .avatar-right-previews {
        width: 200px;
        height: 200px;
        overflow: hidden;
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