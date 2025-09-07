<template>
    <n-button @click="loadCube">load Cube</n-button>
    <n-button @click="loadGLBFile">load GLB file</n-button>
    <n-button @click="loadSTLFile">load STL file</n-button>
    <div ref="canvasContainer" class="canvas-container"></div>
</template>
  
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'
    
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { STLLoader } from 'three/addons/loaders/STLLoader.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    const canvasContainer = ref(null)
    let scene, camera, renderer,controls, cube
    
    // 初始化场景
    function initScene() {
        // 1. 创建场景
        scene = new THREE.Scene()
        
        // 2. 创建相机（透视相机）
        camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight,
        0.1,
        1000
        )
        camera.position.z = 5
    
        // 3. 创建渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        
        // 4. 挂载到DOM
        canvasContainer.value.appendChild(renderer.domElement)
    }
    
    function initLight() {
    //     hesLight = new THREE.HemisphereLight(0xffffff,0xffffff)
    //     hesLight.intensity = 0.8
    //     scene.add(hesLight)
    //     dirLight = new THREE.DirectionalLight()
    //     dirLight.position.set(5,5,5)
    //     scene.add(dirLight)
    //     sportLight = new THREE.SpotLight(0xffffff)
    //     sportLight.position.set(0,10,10)
    //      scene.add(sportLight)               

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 10, 10)
        scene.add(directionalLight);
    }

    function initControls() { 
        controls = new OrbitControls(camera, renderer.domElement)
    }

    // 创建立方体
    function createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        wireframe: true 
        })
        cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
    }
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate)
        
        // cube.rotation.x += 0.01
        // cube.rotation.y += 0.01
        
        renderer.render(scene, camera)
    }
    
    async function loadGLBFile()
    {
        const loader = new GLTFLoader()

        //loader.load( 'models/gltf/chinese_house.glb',function(gltf) {
        loader.load( 'glb-3.glb',function(gltf) {
            console.log(gltf);  
            scene.add(gltf.scene)
        })
    }

    async function loadSTLFile()
    {
        const loader = new STLLoader();
        const geometry = await loader.loadAsync( './1641922.stl' )
        scene.add( new THREE.Mesh( geometry ) );
    }

    function loadCube()
    {
        createCube()
        animate()
    }

    onMounted(() => {
        initScene()
        initLight();
        animate();
        initControls();
        //loadFile();
        
    })
    
    // 组件卸载时清理资源
    onUnmounted(() => {
        if (renderer) {
            renderer.dispose()
        }
    })
</script>
  
<style>
  .canvas-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    overflow: hidden;
  }
</style>
  
  