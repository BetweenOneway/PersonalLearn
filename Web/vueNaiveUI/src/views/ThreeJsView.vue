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
    
    // 窗口大小变化处理
    function onWindowResize() {
        if (!canvasContainer.value) return;
        
        const width = canvasContainer.value.clientWidth;
        const height = canvasContainer.value.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // 初始化场景
    function initScene() {
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x1B5050)
    }
    
    function initAxesHelper() {
        let axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,100)
        camera.position.set(1.5,1.5,1.5)
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({antialias:true})
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth,window.innerHeight) 
        canvasContainer.value.appendChild(renderer.domElement)
    }

    function initLight() {
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
    
    function initMesh() {
        
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

        window.addEventListener('resize', onWindowResize);
    })
    
    // 组件卸载时清理资源
    onUnmounted(() => {
        window.removeEventListener('resize', onWindowResize);
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
  
  