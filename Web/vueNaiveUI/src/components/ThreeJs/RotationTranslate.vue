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
        //x轴 红色 y轴 绿色 z轴 蓝色
        axesHelper.setColors(0xff0000,0x00ff00,0x0000ff)
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
    let originDirection = ref(null);
    let arrowLength = ref(2);
    let arrow;

    function addModelToScene()
    {
        src.value = new THREE.Vector3(0, 0, 0)
        direction.value = new THREE.Vector3(1, 0, 0).normalize();
        originDirection.value = direction.value;
        console.log("origin direction=>",direction.value);

        arrow = new THREE.ArrowHelper(
            direction.value,
            src.value,
            arrowLength.value,
            0xff00ff,
            0.5,
            0.3
        );
        scene.add(arrow);
    }

    function RotateArrow(x,y,z)
    {
        console.log("Rotate arrow")
        //角度转弧度
        const rx = THREE.MathUtils.degToRad(x || 0);
        const ry = THREE.MathUtils.degToRad(y || 0);
        const rz = THREE.MathUtils.degToRad(z || 0);

        console.log(`rx=>${rx},ry=>${ry},rz=>${rz}`)

        //这个旋转有缺陷 当值是(45,45,0)时会出现结果错误
        arrow.rotation.x += rx;
        arrow.rotation.y += ry;
        arrow.rotation.z += rz;

        const test1 = ()=>{
            let vec = direction.value;
            if(rx)
            {
                const axis = new THREE.Vector3(1, 0, 0); // 旋转轴（X轴）
                console.log("rz=>",rx);
                vec.applyAxisAngle(axis, rx);
                vec.normalize();
            }
            
            if(ry)
            {
                const axis = new THREE.Vector3(0, 1, 0); // 旋转轴（Y轴）
                console.log("ry=>",ry);
                vec.applyAxisAngle(axis, ry); 
                vec.normalize();
            }
            if(rz)
            {
                const axis = new THREE.Vector3(0, 0, 1); // 旋转轴（Z轴）
                console.log("rz=>",rz);
                vec.applyAxisAngle(axis, rz); 
                vec.normalize();
            }
            console.log("vec=>",vec)

            let newArrow = new THREE.ArrowHelper(
                vec,
                src.value,
                arrowLength.value,
                0x000000,
                0.5,
                0.3
            );
            scene.add(newArrow);
        }

        test1();
        
        const test2 = ()=>{
            let vec = direction.value.normalize();
            console.log("test2 origin direction=>",vec);
            var euler = new THREE.Euler(rx,ry,rz,'ZYX'); 
            console.log("euler.order=>",euler.order);
            vec.applyEuler(euler);
            vec.normalize();
            console.log("test2 vec=>",vec)

            let newArrow = new THREE.ArrowHelper(
                vec,
                src.value,
                arrowLength.value,
                0x000000,
                0.5,
                0.3
            );
            scene.add(newArrow);
        }
        //test2();

        if(true)
        {
            let worldDir = new THREE.Vector3();
            arrow.getWorldDirection(worldDir);
            console.log("rotated worldDir=>",worldDir)
        }
        else{
            // 2. 定义与 ArrowHelper.rotation 相同的欧拉角（旋转参数）
            const rotation = new THREE.Euler(
                arrow.rotation.x,  // 与箭头X轴旋转相同
                arrow.rotation.y,  // 与箭头Y轴旋转相同
                arrow.rotation.z,  // 与箭头Z轴旋转相同
                arrow.rotation.order // 保持相同的旋转顺序（默认"XYZ"）
            );

            // 3. 将欧拉角转换为四元数（模拟Three.js内部处理）
            const quaternion = new THREE.Quaternion().setFromEuler(rotation);

            // 4. 应用旋转到向量（与箭头旋转效果一致）
            direction.value = originDirection.value.clone().applyQuaternion(quaternion).normalize();
        }
    }

    function GetDirection()
    {
        console.log("origin direction=>",direction.value)
        console.log("get arrow.matrix=>",arrow.matrix)
        console.log("get arrow.matrixWorld=>",arrow.matrixWorld)

        let tempDir1 = direction.value;
        let newDirection = tempDir1.applyMatrix4(arrow.matrixWorld).sub(arrow.position).normalize();
        console.log("new direction=>",newDirection);

        let worldDir = new THREE.Vector3();
        arrow.getWorldDirection(worldDir);
        console.log("worldDir=>",worldDir)

        let tempDir2 = direction.value;
        const dir = tempDir2.applyQuaternion(arrow.quaternion);
        console.log("dir=>",dir)

        const actualDir = direction.value; // 原始局部方向
        actualDir.applyMatrix4(arrow.matrixWorld).normalize(); // 应用世界矩阵变换
        console.log("实际指向方向1:", actualDir); // {x: 1, y: 0, z: 0}

        const actualDir1 = direction.value; // 原始局部方向
        actualDir1.applyMatrix4(arrow.matrix).normalize(); // 应用世界矩阵变换
        console.log("实际指向方向2:", actualDir1); // {x: 1, y: 0, z: 0}
    }

    window.RotateArrow = RotateArrow;
    window.GetDirection = GetDirection;

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
