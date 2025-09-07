<template>
    <div id="container"></div>
</template>

<script setup>
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    // 定义变量
    let scene,camera,renderer
    let axesHelper
    let hesLight,dirLight,sportLight 
    let controls       
    
    // 初始化场景
    initScene()
    // 初始化辅助轴
    initAxesHelper()
    // 初始化灯光
    initLight()
    // 初始化mesh
    initMesh()
    // 初始化相机
    initCamera()
    // 初始化渲染器
    initRenderer()
    // 循环动画
    animate()
    // 初始化轨道控制器
    initControls()


    window.addEventListener('resize',function() { 
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth,window.innerHeight)
    })

    function initScene() {
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)
    }

    function initAxesHelper() {
        // axesHelper = new THREE.AxesHelper(5)
        // scene.add(axesHelper)
    }
    
    function initLight() {            
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 10, 10)
        scene.add(directionalLight);
    }

    function initMesh() {
        
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,100)
        camera.position.set(1.5,1.5,1.5)
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({antialias:true})
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth,window.innerHeight) 
        document.body.appendChild(renderer.domElement) 
    }

    function initControls() { 
        controls = new OrbitControls(camera, renderer.domElement)
    }

    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene,camera)
    }

    const loader = new GLTFLoader()

    //loader.load( 'models/gltf/chinese_house.glb',function(gltf) {
    loader.load( 'glb-3.glb',function(gltf) {
        console.log(gltf);  
        scene.add(gltf.scene)
    })

    //解决加载gltf格式模型纹理贴图和原图不一样问题
    renderer.outputEncoding = THREE.sRGBEncoding;
</script>