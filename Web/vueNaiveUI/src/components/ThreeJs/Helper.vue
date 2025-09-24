<template>
    <div v-if="vueWay == false">
        <canvas id="c"></canvas>
    </div>
    <div id="conatiner" ref="canvasContainer" v-else></div>
</template>
<script setup>
    import { onMounted,ref } from 'vue';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const vueWay = ref(true);
    const canvasContainer = ref(null);

    let renderer,material,controls;
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
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        //创建场景
        const scene = new THREE.Scene();

        controls = new OrbitControls(camera, renderer.domElement)
        
        // 1. 坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // 2. 网格辅助器
        const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0x999999);
        gridHelper.rotation.x = Math.PI / 2; // 沿XZ平面显示
        scene.add(gridHelper);

        // 3. 箭头辅助器
        const arrowX = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            3,
            0xff0000,
            0.5,
            0.3
        );
        scene.add(arrowX);

        const arrowY = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(2, 0, 0),
            3,
            0x00ff00,
            0.5,
            0.3
        );
        scene.add(arrowY);

        // 4. 创建立方体并添加包围盒辅助器
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 1, 0);
        scene.add(cube);

        const boxHelper = new THREE.BoxHelper(cube, 0xff0000);
        scene.add(boxHelper);

        // 5. 相机辅助器
        const cameraHelper = new THREE.CameraHelper(camera);
        scene.add(cameraHelper);

        // 相机位置
        camera.position.z = 15;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);

        // 动画循环
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();

        // 窗口大小调整
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    })
</script>
<style scoped>
    #c {
        width: 100%;
        height: 100vh;
    }
</style>