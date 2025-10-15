<template>
    <div class="flex flex-col h-screen bg-gray-100 overflow-hidden">
        <!-- 主内容区 -->
        <main class="flex flex-1 overflow-hidden">        
            <!-- 中间Three.js渲染区域 -->
            <div class="flex-1 relative">
                <canvas ref="renderCanvas" class="w-full h-full"></canvas>
            </div>
        </main>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, onUnmounted, watch } from 'vue';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
    // 状态管理
    const renderCanvas = ref(null);
    const rays = ref([]);
    const showAxes = ref(true);
    const showGrid = ref(true);
  
    // Three.js核心对象
    let scene, camera, renderer, controls;
    let raycaster, mouse;
    let gridHelper, axesHelper;
    let animationId = null;

    

    // 初始化Three.js场景
    function initThreeJS() {
        // 创建场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        
        // 创建相机
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        
        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ canvas: renderCanvas.value, antialias: true });
        renderer.setSize(renderCanvas.value.clientWidth, renderCanvas.value.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
        
        // 添加辅助网格和坐标轴
        gridHelper = new THREE.GridHelper(20, 20, 0xe2e8f0, 0xe2e8f0);
        scene.add(gridHelper);
        
        axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        // 创建轨道控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        
        // 初始化射线投射器和鼠标位置
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // 开始动画循环
        startAnimationLoop();
    }
    
    // 动画循环
    function startAnimationLoop() {
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    }
  
    // 处理窗口大小变化
    function handleWindowResize() {
        if (!camera || !renderer) return;
        
        const container = renderCanvas.value.parentElement;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
  
    // 切换坐标轴显示
    function toggleAxes() {
        showAxes.value = !showAxes.value;
        axesHelper.visible = showAxes.value;
    }
    
    // 切换网格显示
    function toggleGrid() {
        showGrid.value = !showGrid.value;
        gridHelper.visible = showGrid.value;
    }
  
    //轴向数据
    let src = ref(null);
    let direction = ref(null);
    let arrowLength = ref(5);
    let arrow;

    function addModelToScene()
    {
        src.value = new THREE.Vector3(0, 0, 0)
        direction.value = new THREE.Vector3(1, 1, 0);
        arrow = new THREE.ArrowHelper(
            src.value,
            direction.value,
            arrowLength.value,
            0xff00ff,
            0.5,
            0.3
        );
        scene.add(arrow);
    }

    // 组件挂载时初始化
    onMounted(() => {
        initThreeJS();
        addModelToScene();
    });
  
    // 组件卸载时清理
    onUnmounted(() => {
        window.removeEventListener('resize', handleWindowResize);
        
        // 清理Three.js资源
        if (scene) {
            rays.value.forEach(ray => {
                scene.remove(ray);
            });
        }
        
        if (renderer) {
            renderer.dispose();
        }
    });
</script>
