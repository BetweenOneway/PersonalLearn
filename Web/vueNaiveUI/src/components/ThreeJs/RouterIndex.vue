
<template>
    <div>
        <h1>ThreeJs学习用例</h1>
        <n-flex>
            <n-button size="large" @click="gotoHerf('basic-example')">
                基础示例
            </n-button>
            <n-button size="large" @click="gotoHerf('scene')">
                场景
            </n-button>
            <n-button size="large" @click="gotoHerf('target-demo')">
                综合成果
            </n-button>
            <n-button size="large" @click="gotoHerf('camera')">
                相机
            </n-button>
            <n-button size="large" @click="gotoHerf('lights')">
                光源
            </n-button>
        </n-flex>
    </div>
  </template>

<script setup>
    import { useRoute,useRouter } from 'vue-router';
    const route = useRoute();
    const router = useRouter();

    function getHerf(url)
    {
        console.log("router.path=>",route.path)
        console.log("type of router.path=>",typeof route.path)
        if(route.path.substring(route.path.length-1,route.path.length) == '/')
        {
            return route.path + url
        }
        else{
            return route.path + '/' + url
        }
        
    }

    function gotoHerf(url)
    {
        router.push(getHerf(url));
    }
</script>