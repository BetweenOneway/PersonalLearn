<template>
    <div class="model-viewer">
        <!-- 工具栏 -->
        <div class="toolbar">
            <input type="file" @change="handleFileUpload" accept=".obj,.stl" class="file-input" />
            
            <div class="controls">
            <button @click="toggleNormals" class="btn">
                {{ showNormals ? '隐藏法线' : '显示法线' }}
            </button>
            <button @click="addRay" class="btn">添加射线</button>
            <button @click="removeSelectedRay" class="btn" :disabled="!selectedRay">
                删除选中射线
            </button>
            <button @click="clearAllRays" class="btn">清除所有射线</button>
            </div>
            
            <div class="status">
                <span v-if="modelLoaded">模型已加载</span>
                <span v-else>请导入OBJ或STL模型</span>
            </div>
        </div>
      
      <!-- 3D渲染区域 -->
      <div ref="canvasContainer" class="canvas-container"></div>
      
      <!-- 射线控制面板 -->
      <div class="ray-controls" v-if="selectedRay">
        <h3>射线控制</h3>
        <div class="control-group">
          <label>X轴位置: {{ selectedRay.position.x.toFixed(2) }}</label>
          <input type="range" min="-10" max="10" step="0.1" 
                 v-model.number="selectedRay.position.x">
        </div>
        <div class="control-group">
          <label>Y轴位置: {{ selectedRay.position.y.toFixed(2) }}</label>
          <input type="range" min="-10" max="10" step="0.1" 
                 v-model.number="selectedRay.position.y">
        </div>
        <div class="control-group">
          <label>Z轴位置: {{ selectedRay.position.z.toFixed(2) }}</label>
          <input type="range" min="-10" max="10" step="0.1" 
                 v-model.number="selectedRay.position.z">
        </div>
        <div class="control-group">
          <label>X轴旋转: {{ selectedRay.rotation.x.toFixed(2) }}</label>
          <input type="range" min="-Math.PI" max="Math.PI" step="0.1" 
                 v-model.number="selectedRay.rotation.x">
        </div>
        <div class="control-group">
          <label>Y轴旋转: {{ selectedRay.rotation.y.toFixed(2) }}</label>
          <input type="range" min="-Math.PI" max="Math.PI" step="0.1" 
                 v-model.number="selectedRay.rotation.y">
        </div>
        <div class="control-group">
          <label>Z轴旋转: {{ selectedRay.rotation.z.toFixed(2) }}</label>
          <input type="range" min="-Math.PI" max="Math.PI" step="0.1" 
                 v-model.number="selectedRay.rotation.z">
        </div>
      </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { STLLoader } from 'three/addons/loaders/STLLoader.js';
    import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
    
    // 组件状态
    const canvasContainer = ref(null);
    const modelLoaded = ref(false);
    const showNormals = ref(false);
    const selectedRay = ref(null);
  
    // Three.js 相关变量
    let scene, camera, renderer, controls;
    let model, normalsHelper;
    let rays = reactive([]);
    let raycaster, mouse;
    
    // 初始化Three.js场景
    function initThreeJS() {
        // 创建场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        // 创建相机
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight);
        canvasContainer.value.appendChild(renderer.domElement);
        
        // 添加轨道控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        
        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // 添加坐标系辅助线
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        // 初始化射线相关
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // 窗口大小变化处理
        window.addEventListener('resize', onWindowResize);
        
        // 射线交互事件
        window.addEventListener('click', onCanvasClick);
        
        // 动画循环
        function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        }
        animate();
    }
  
    // 窗口大小变化处理
    function onWindowResize() {
        if (!canvasContainer.value) return;
        
        const width = canvasContainer.value.clientWidth;
        const height = canvasContainer.value.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
  
    // 处理文件上传
    function handleFileUpload(event) {
        const file = event.target.files[0];
        console.log("input file=>",file);
        if (!file) 
        {
            return;
        }
        
        // 清除现有模型
        if (model) {
            scene.remove(model);
            model = null;
        }
        
        if (normalsHelper) {
            scene.remove(normalsHelper);
            normalsHelper = null;
        }
        
        const reader = new FileReader();
        
        if (file.name.endsWith('.obj')) {
            console.log("load obj model")
            reader.onload = function(e) {
                const loader = new OBJLoader();
                loader.parse(e.target.result, '', (object) => {
                model = object;
                setupModel();
                });
            };
            reader.readAsText(file);
        } else if (file.name.endsWith('.stl')) {
            console.log("load stl model")
            reader.onload = function(e) {
                const loader = new STLLoader();
                const geometry = loader.parse(e.target.result);
                const material = new THREE.MeshPhongMaterial({ 
                color: 0x7777ff, 
                shininess: 100 
                });
                model = new THREE.Mesh(geometry, material);
                setupModel();
            };
            reader.readAsArrayBuffer(file);
        }
        
        // 重置文件输入，允许重复选择同一文件
        event.target.value = '';
    }
    
    // 设置模型
    function setupModel() {
        // 居中模型
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // 缩放模型以适应视图
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        model.scale.set(scale, scale, scale);
        
        scene.add(model);
        modelLoaded.value = true;
        
        // 如果需要，显示法线
        if (showNormals.value) {
            showModelNormals();
        }
    }
    
    // 显示模型法线
    function showModelNormals() {
        if (!model || normalsHelper) return;
        
        // 为模型中的每个网格创建法线辅助
        normalsHelper = new THREE.Group();
        model.traverse(function(child) {
        if (child.isMesh) {
            const helper = new VertexNormalsHelper(child, 0.1, 0xff0000);
            normalsHelper.add(helper);
        }
        });
        
        scene.add(normalsHelper);
    }
    
    // 隐藏模型法线
    function hideModelNormals() {
        if (normalsHelper) {
        scene.remove(normalsHelper);
        normalsHelper = null;
        }
    }
    
    // 切换法线显示状态
    function toggleNormals() {
        showNormals.value = !showNormals.value;
        
        if (showNormals.value && model) {
        showModelNormals();
        } else {
        hideModelNormals();
        }
    }
    
    // 添加射线
    function addRay() {
        // 创建射线几何体
        const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -3)
        ]);
        
        // 创建射线材质
        const material = new THREE.LineBasicMaterial({ 
        color: 0x00ff00,
        linewidth: 2
        });
        
        // 创建射线对象
        const ray = new THREE.Line(geometry, material);
        
        // 添加射线起点标记
        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        ray.add(sphere);
        
        // 设置射线初始位置（在模型前方）
        if (model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        ray.position.copy(center);
        ray.position.z += size.z / 2 + 1;
        } else {
        ray.position.set(0, 0, 3);
        }
        
        // 添加到场景和射线数组
        scene.add(ray);
        rays.push(ray);
        
        // 选中新添加的射线
        selectedRay.value = ray;
    }
    
    // 移除选中的射线
    function removeSelectedRay() {
        if (!selectedRay.value) return;
        
        const index = rays.indexOf(selectedRay.value);
        if (index !== -1) {
        scene.remove(selectedRay.value);
        rays.splice(index, 1);
        selectedRay.value = null;
        }
    }
    
    // 清除所有射线
    function clearAllRays() {
        rays.forEach(ray => {
        scene.remove(ray);
        });
        rays.length = 0;
        selectedRay.value = null;
    }
    
    // 处理画布点击事件（用于选择射线）
    function onCanvasClick(event) {
        if (!canvasContainer.value) return;
        
        // 计算鼠标在标准化设备坐标中的位置
        const rect = canvasContainer.value.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);
        
        // 检查与射线的交点
        const intersects = raycaster.intersectObjects(rays);
        
        if (intersects.length > 0) {
        // 选中第一个相交的射线
        selectedRay.value = intersects[0].object.parent || intersects[0].object;
        } else {
        // 未选中任何射线
        selectedRay.value = null;
        }
    }
    
    // 组件挂载时初始化
    onMounted(() => {
        initThreeJS();
    });
    
    // 组件卸载时清理
    onUnmounted(() => {
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('click', onCanvasClick);
        
        if (renderer) {
        renderer.dispose();
        if (canvasContainer.value && renderer.domElement) {
            canvasContainer.value.removeChild(renderer.domElement);
        }
        }
    });
    
    // 监听射线属性变化，更新射线方向
    watch(() => selectedRay.value, (newRay) => {
        if (!newRay) return;
        
        const updateRayDirection = () => {
        if (!newRay.geometry) return;
        
        // 获取射线的方向向量（基于旋转）
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(newRay.quaternion);
        
        // 更新射线的终点
        const endPoint = direction.clone().multiplyScalar(3);
        newRay.geometry.setFromPoints([
            new THREE.Vector3(0, 0, 0),
            endPoint
        ]);
        };
        
        // 监听旋转变化
        const rotationWatcher = watch(
        () => [newRay.rotation.x, newRay.rotation.y, newRay.rotation.z],
        updateRayDirection,
        { deep: true }
        );
        
        // 清理函数
        return () => {
        rotationWatcher();
        };
    });
</script>
  
<style scoped>
  .model-viewer {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
  }
  
  .toolbar {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    gap: 20px;
  }
  
  .file-input {
    padding: 5px;
  }
  
  .controls {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 6px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  .status {
    margin-left: auto;
    color: #495057;
  }
  
  .canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .ray-controls {
    position: absolute;
    top: 70px;
    right: 20px;
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 250px;
  }
  
  .control-group {
    margin-bottom: 10px;
  }
  
  .control-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #495057;
  }
  
  .control-group input {
    width: 100%;
  }
</style>
  