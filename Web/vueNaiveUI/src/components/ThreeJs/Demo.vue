<template>
    <div v-if="vueWay == false">
        <canvas id="c"></canvas>
    </div>
    <div id="conatiner" ref="canvasContainer" v-else></div>
</template>
<script setup>
    import { onMounted,ref } from 'vue';
    import * as THREE from 'three';

    const vueWay = ref(true);
    const canvasContainer = ref(null);
    const needAnimation = ref(true);

    let renderer,material;
    onMounted(()=>{
        if(!vueWay.value)
        {
            //选择画布
            const canvas = document.querySelector("#c")
            //创建渲染器
            renderer = new THREE.WebGLRenderer({antialias:true,canvas})
        }
        else{
            renderer = new THREE.WebGLRenderer({antialias:true})
            //改动这个size需要同步改动camera.aspect
            renderer.setSize(500,500);
            canvasContainer.value.appendChild(renderer.domElement);
        }

        //创建相机
        const fov = 75;
        //renderer.width/renderer.height 默认值写2
        const aspect = vueWay.value ? 1 : 2;
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        camera.position.z  = 2;

        //创建场景
        const scene = new THREE.Scene();

        //创建图形
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth,boxHeight,boxDepth);

        //创建网格材质
        //material = new THREE.MeshBasicMaterial({color:0x44aa88});

        //有明暗区别
        material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // 绿蓝色
        //创建网格
        const cube = new THREE.Mesh(geometry,material);
        //将网格添加到场景中
        scene.add(cube);

        //增加光
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        //渲染器渲染场景
        renderer.render(scene,camera);

        if(needAnimation)
        {
            //这里完成了动画效果
            function render(time) {
                time *= 0.001;  // 将时间单位变为秒
                
                cube.rotation.x = time;
                cube.rotation.y = time;
                
                renderer.render(scene, camera);
                
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        }
    })
</script>
<style scoped>
    #c {
        width: 100%;
        height: 100vh;
    }
</style>