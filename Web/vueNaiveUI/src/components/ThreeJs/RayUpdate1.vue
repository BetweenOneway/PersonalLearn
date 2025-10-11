<template>
    <div class="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <!-- 顶部导航栏 -->
      <header class="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center z-10">
        <div class="flex items-center space-x-2">
          <i class="fa fa-cube text-blue-500 text-2xl"></i>
          <h1 class="text-xl font-bold">射线可视化编辑器</h1>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 常用功能按钮 -->
          <button @click="toggleAxes" class="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
            <i class="fa fa-crosshairs mr-2"></i>坐标轴
          </button>
          <button @click="toggleGrid" class="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
            <i class="fa fa-th mr-2"></i>网格
          </button>
          <button @click="deleteAllRays" class="bg-red-500 text-white px-3 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
            <i class="fa fa-trash mr-2"></i>清除所有
          </button>
          <button @click="resetView" class="bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
            <i class="fa fa-refresh mr-2"></i>重置视图
          </button>
        </div>
      </header>
  
        <!-- 主内容区 -->
        <main class="flex flex-1 overflow-hidden">
            <!-- 左侧控制面板 -->
            <div id="control-panel" class="w-64 bg-white shadow-lg p-4 flex flex-col transition-all duration-300 transform z-10">
                <!-- 文件上传区域 -->
                <div class="mb-6 pb-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold mb-3">文件操作</h2>
                    
                    <!-- 未上传文件时显示的上传区域 -->
                    <div v-show="!uploadedFileName" class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                        @click="triggerFileInput"
                        @dragover.prevent @dragenter.prevent @dragleave.prevent
                        @drop.prevent="handleDrop">
                        <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-3"></i>
                        <p class="text-sm text-gray-600 mb-2">点击或拖拽.verts文件到此处上传</p>
                        <p class="text-xs text-gray-400">支持的格式: .verts</p>
                        <input type="file" id="file-input" ref="fileInput" accept=".verts" class="hidden" @change="handleFileUpload">
                    </div>
                    
                    <!-- 已上传文件时显示的文件信息 -->
                    <div v-show="uploadedFileName" class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center">
                        <i class="fa fa-file-text-o text-blue-500 mr-2 mt-0.5"></i>
                        <span class="text-sm truncate max-w-[160px]" :title="uploadedFileName">{{ uploadedFileName }}</span>
                        </div>
                        <button @click="clearUploadedFile" class="text-gray-400 hover:text-red-500 transition-colors">
                        <i class="fa fa-times"></i>
                        </button>
                    </div>
                    <div class="flex space-x-2">
                        <button @click="reloadFile" class="flex-1 bg-gray-200 text-gray-700 text-xs p-1.5 rounded transition-all hover:bg-gray-300">
                        <i class="fa fa-refresh mr-1"></i>重新加载
                        </button>
                        <button @click="triggerFileInput" class="flex-1 bg-blue-500 text-white text-xs p-1.5 rounded transition-all hover:bg-blue-600">
                        <i class="fa fa-exchange mr-1"></i>更换文件
                        </button>
                    </div>
                    </div>
                </div>
            
                <!-- 射线控制区域 -->
                <div class="mb-6">
                    <h2 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">射线控制</h2>
                    
                    <!-- 工具选择 -->
                    <div class="mb-4">
                    <h3 class="font-medium mb-2 text-sm text-gray-600">操作工具</h3>
                    <div class="flex space-x-2">
                        <button 
                        @click="setActiveTool('translate')" 
                        :class="['flex-1 py-2 rounded-md text-sm transition-all duration-200', activeTool === 'translate' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                        >
                        <i class="fa fa-arrows mr-1"></i>平移
                        </button>
                        <button 
                        @click="setActiveTool('rotate')" 
                        :class="['flex-1 py-2 rounded-md text-sm transition-all duration-200', activeTool === 'rotate' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                        >
                        <i class="fa fa-repeat mr-1"></i>旋转
                        </button>
                    </div>
                    </div>
                    
                    <div v-if="!selectedRay && rays.length === 0" class="flex-1 flex flex-col items-center justify-center text-gray-500 py-6">
                        <i class="fa fa-file-o text-3xl mb-2"></i>
                        <p class="text-sm text-center">请上传.verts文件加载射线数据</p>
                    </div>
                    
                    <div v-else-if="!selectedRay && rays.length > 0" class="flex-1 flex flex-col items-center justify-center text-gray-500 py-6">
                        <i class="fa fa-hand-pointer-o text-3xl mb-2"></i>
                        <p class="text-sm text-center">请在场景中选择一条射线</p>
                    </div>
                    
                    <div v-else class="space-y-4">
                        <div>
                            <h3 class="font-medium mb-2 text-sm text-gray-600">射线信息</h3>
                            <div class="bg-gray-50 p-3 rounded-md text-sm">
                            <p><span class="text-gray-500">ID:</span> {{ selectedRay.userData.id }}</p>
                            <p><span class="text-gray-500">起点:</span> ({{ formatVector(selectedRay.position) }})</p>
                            <p><span class="text-gray-500">方向:</span> ({{ formatDirection(selectedRay) }})</p>
                            </div>
                        </div>
                    
                        <div>
                            <h3 class="font-medium mb-2 text-sm text-gray-600">偏移控制</h3>
                            <div class="grid grid-cols-3 gap-2">
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-500 mb-1">X</label>
                                <input type="number" v-model.number="translate.x" step="0.1" class="text-sm border border-gray-300 rounded px-2 py-1">
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-500 mb-1">Y</label>
                                <input type="number" v-model.number="translate.y" step="0.1" class="text-sm border border-gray-300 rounded px-2 py-1">
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-500 mb-1">Z</label>
                                <input type="number" v-model.number="translate.z" step="0.1" class="text-sm border border-gray-300 rounded px-2 py-1">
                            </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="font-medium mb-2 text-sm text-gray-600">旋转控制</h3>
                            <div class="grid grid-cols-3 gap-2">
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-500 mb-1">X轴</label>
                                <input type="number" v-model.number="rotate.x" step="5" class="text-sm border border-gray-300 rounded px-2 py-1">
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-500 mb-1">Y轴</label>
                                <input type="number" v-model.number="rotate.y" step="5" class="text-sm border border-gray-300 rounded px-2 py-1">
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-500 mb-1">Z轴</label>
                                <input type="number" v-model.number="rotate.z" step="5" class="text-sm border border-gray-300 rounded px-2 py-1">
                            </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="font-medium mb-2 text-sm text-gray-600">射线长度</h3>
                            <input type="number" v-model.number="rayLength" step="0.1" min="0.1" class="text-sm border border-gray-300 rounded px-2 py-1 w-full">
                        </div>
                    
                        <div class="flex space-x-2">
                            <button @click="resetRayTransform" class="flex-1 bg-gray-200 text-gray-700 p-2 rounded-md text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                            <i class="fa fa-refresh mr-1"></i>重置
                            </button>
                            <button @click="deleteSelectedRay" class="flex-1 bg-red-500 text-white p-2 rounded-md text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                            <i class="fa fa-trash mr-1"></i>删除
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 场景信息 -->
                <div class="mt-auto pt-4 border-t border-gray-200">
                    <h3 class="font-medium mb-2 text-sm text-gray-600">场景信息</h3>
                    <div class="bg-gray-50 p-3 rounded-md text-sm">
                    <p><span class="text-gray-500">射线总数:</span> {{ rays.length }}</p>
                    <p><span class="text-gray-500">选中射线:</span> {{ selectedRay ? 1 : 0 }}</p>
                    </div>
                </div>
            </div>
            
            <!-- Three.js渲染区域 -->
            <div class="flex-1 relative">
                <canvas ref="renderCanvas" class="w-full h-full"></canvas>
                
                <!-- 操作提示 -->
                <div class="absolute bottom-4 left-4 bg-gray-800/80 text-white px-4 py-2 rounded-md text-sm backdrop-blur-sm">
                    <p class="mb-1"><i class="fa fa-info-circle mr-1"></i>操作提示:</p>
                    <ul class="list-disc list-inside text-xs space-y-0.5">
                    <li>左键拖动: 旋转视图</li>
                    <li>右键拖动: 平移视图</li>
                    <li>滚轮: 缩放视图</li>
                    <li>点击射线: 选择射线</li>
                    <li>ESC: 取消选择</li>
                    </ul>
                </div>
                
                <!-- 加载指示器 -->
                <div v-if="isLoading" class="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
                    <div class="bg-white p-6 rounded-lg flex items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                    <p>加载中...</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
  
<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
  const fileInput = ref();
  // 状态管理
  const renderCanvas = ref(null);
  const rays = ref([]);
  const selectedRay = ref(null);
  const activeTool = ref('translate');
  const isLoading = ref(false);
  const showAxes = ref(true);
  const showGrid = ref(true);
  const rayLength = ref(1.0);
  const uploadedFileName = ref(''); // 存储上传的文件名
  const currentFile = ref(null); // 存储当前上传的文件对象
  
  // 变换控制
  const translate = ref({ x: 0, y: 0, z: 0 });
  const rotate = ref({ x: 0, y: 0, z: 0 });
  
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
  
  // 绑定事件处理
  function bindEvents() {
    window.addEventListener('resize', handleWindowResize);
    
    // 画布点击事件 - 选择射线
    renderCanvas.value.addEventListener('click', onCanvasClick);
    
    // 键盘事件 - ESC取消选择
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        deselectRay();
      }
    });
  }
  
    // 处理画布点击事件
    function onCanvasClick(event) {
        if (!raycaster || !camera) return;
        
        // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
        const rect = renderCanvas.value.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);
        
        // 检查与射线的交点
        const intersects = raycaster.intersectObjects(rays.value, true);
        
        if (intersects.length > 0) {
        // 找到最接近的射线组
        const closest = intersects[0].object;
        const rayGroup = findRayGroup(closest);
        
        if (rayGroup) {
            selectRay(rayGroup);
        }
        } else {
            // 未点击任何射线，取消选择
            deselectRay();
        }
    }
  
  // 查找射线组（从子对象向上查找）
  function findRayGroup(object) {
    let current = object;
    while (current && !rays.value.includes(current)) {
      current = current.parent;
    }
    return current;
  }
  
    // 选择射线
    function selectRay(rayGroup) {
        // 如果已经选中了这条射线，不做处理
        if (selectedRay.value === rayGroup) return;
        
        // 保存当前选中射线的变换状态
        if (selectedRay.value) {
            saveRayTransform(selectedRay.value);
            // 恢复之前选中射线的颜色
            const arrowHelper = selectedRay.value.children[0];
            if (arrowHelper instanceof THREE.ArrowHelper) {
                arrowHelper.setColor(new THREE.Color(0x3B82F6)); // 恢复蓝色
            }
            // 恢复起点标记的颜色
            const point = selectedRay.value.children[1];
            if (point.material) {
                point.material.color.set(0x3B82F6);
            }
        }
        
        // 设置新的选中射线
        selectedRay.value = rayGroup;
        
        // 更改选中射线的颜色
        const arrowHelper = rayGroup.children[0];
        if (arrowHelper instanceof THREE.ArrowHelper) {
            arrowHelper.setColor(new THREE.Color(0x8B5CF6)); // 紫色表示选中
        }
        // 更改起点标记的颜色
        const point = rayGroup.children[1];
        if (point.material) {
            point.material.color.set(0x8B5CF6);
        }
        
        // 加载新选中射线的变换状态
        loadRayTransform(rayGroup);
    }
  
    // 取消选择射线
    function deselectRay() {
        if (selectedRay.value) {
        // 保存当前选中射线的变换状态
        saveRayTransform(selectedRay.value);
        
        // 恢复射线原来的颜色
        const arrowHelper = selectedRay.value.children[0];
        if (arrowHelper instanceof THREE.ArrowHelper) {
            arrowHelper.setColor(new THREE.Color(0x3B82F6)); // 恢复蓝色
        }
        // 恢复起点标记的颜色
        const point = selectedRay.value.children[1];
        if (point.material) {
            point.material.color.set(0x3B82F6);
        }
        
        selectedRay.value = null;
        }
    }
  
    // 保存射线的变换状态
    function saveRayTransform(rayGroup) {
        // 保存当前旋转值（角度）
        rayGroup.userData.currentRotation = {
        x: rotate.value.x,
        y: rotate.value.y,
        z: rotate.value.z
        };
        
        // 保存当前平移值
        rayGroup.userData.currentTranslation = {
        x: translate.value.x,
        y: translate.value.y,
        z: translate.value.z
        };
    }
  
    // 加载射线的变换状态
    function loadRayTransform(rayGroup) {
        // 加载保存的旋转值，如果没有则使用0
        if (rayGroup.userData.currentRotation) {
            rotate.value = { ...rayGroup.userData.currentRotation };
        } else {
            rotate.value = { x: 0, y: 0, z: 0 };
        }
        
        // 加载保存的平移值，如果没有则使用0
        if (rayGroup.userData.currentTranslation) {
            translate.value = { ...rayGroup.userData.currentTranslation };
        } else {
            translate.value = { x: 0, y: 0, z: 0 };
        }
    }
  
    // 重置变换输入
    function resetTransformInputs() {
        translate.value = { x: 0, y: 0, z: 0 };
        rotate.value = { x: 0, y: 0, z: 0 };
    }
  
    // 触发文件选择对话框
    function triggerFileInput() {
        console.log("fileInput=>",fileInput);
        fileInput.value.click();
    }
  
    // 处理文件上传
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        processFile(file);
    }
  
    // 处理拖放文件
    function handleDrop(event) {
        const file = event.dataTransfer.files[0];
        if (!file) return;
        
        // 检查文件类型
        if (file.name.endsWith('.verts')) {
        processFile(file);
        } else {
        alert('请上传.verts格式的文件');
        }
    }
    
    // 处理并加载文件
    function processFile(file) {
        // 显示加载指示器
        isLoading.value = true;
        
        // 保存文件名和文件对象
        uploadedFileName.value = file.name;
        currentFile.value = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
        try {
            const content = e.target.result;
            const newRays = parseVertsFile(content);
            
            // 清除现有射线
            clearAllRays();
            
            // 添加新射线
            newRays.forEach(rayData => {
            addRay(rayData.origin, rayData.direction);
            });
            
            // 自动调整视图以显示所有射线
            fitCameraToRays();
        } catch (error) {
            console.error('Error parsing .verts file:', error);
            alert('解析文件时出错: ' + error.message);
        } finally {
            // 隐藏加载指示器
            isLoading.value = false;
            // 重置文件输入，允许重复选择同一文件
            //fileInput.value.value = '';
        }
        };
        
        reader.onerror = function() {
            alert('读取文件时出错');
            isLoading.value = false;
        };
        
        reader.readAsText(file);
    }
  
    // 重新加载当前文件
    function reloadFile() {
        if (currentFile.value) {
        processFile(currentFile.value);
        }
    }
  
    // 清除已上传的文件
    function clearUploadedFile() {
        if (confirm('确定要清除当前文件并删除所有射线吗？')) {
        uploadedFileName.value = '';
        currentFile.value = null;
        clearAllRays();
        selectedRay.value = null;
        }
    }
  
  // 解析.verts文件
  function parseVertsFile(content) {
    const lines = content.trim().split('\n');
    const vertices = [];  // 存储射线起点 (v)
    const normals = [];   // 存储射线方向 (vn)
    
    // 解析每一行
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(/\s+/);
      if (parts.length !== 4) {
        throw new Error(`第 ${i+1} 行格式不正确，需要4个元素（类型 + 3个数值）`);
      }
      
      const type = parts[0];
      const values = parts.slice(1).map(Number);
      
      if (values.some(isNaN)) {
        throw new Error(`第 ${i+1} 行包含非数值数据`);
      }
      
      if (type === 'v') {
        // 射线起点
        vertices.push(new THREE.Vector3(values[0], values[1], values[2]));
      } else if (type === 'vn') {
        // 射线方向
        normals.push(new THREE.Vector3(values[0], values[1], values[2]));
      } else {
        throw new Error(`第 ${i+1} 行包含未知类型 "${type}"，只支持v和vn`);
      }
    }
    
    // 验证v和vn的数量是否一致
    if (vertices.length !== normals.length) {
      throw new Error(`顶点(v)和法向量(vn)数量不一致: v=${vertices.length}, vn=${normals.length}`);
    }
    
    if (vertices.length === 0) {
      throw new Error('文件中未找到有效的射线数据');
    }
    
    // 配对形成射线
    return vertices.map((origin, index) => {
      const direction = normals[index];
      // 归一化法向量确保方向正确
      direction.normalize();
      return { origin, direction };
    });
  }
  
  // 添加射线到场景 - 使用ArrowHelper实现
  function addRay(origin, direction) {
    // 创建ArrowHelper - 参数: 方向向量, 起点, 长度, 颜色, 箭头长度, 箭头宽度
    const arrowHelper = new THREE.ArrowHelper(
      direction.clone(), // 方向
      new THREE.Vector3(0, 0, 0), // 起点（相对于组）
      rayLength.value, // 长度
      0x3B82F6, // 颜色
      rayLength.value * 0.15, // 箭头长度（占总长度的15%）
      rayLength.value * 0.08 // 箭头宽度（占总长度的8%）
    );
    
    // 创建射线起点的标记点
    const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x3B82F6 });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    
    // 创建一个组来包含射线的所有部分
    const rayGroup = new THREE.Group();
    rayGroup.add(arrowHelper);
    rayGroup.add(point);
    
    // 设置射线的初始位置（箭头辅助器的位置由组控制）
    rayGroup.position.copy(origin);
    
    // 存储射线的原始数据和当前变换状态
    rayGroup.userData = {
      originalPosition: new THREE.Vector3().copy(origin),
      originalDirection: new THREE.Vector3().copy(direction),
      originalRotation: new THREE.Euler().copy(rayGroup.rotation),
      currentRotation: { x: 0, y: 0, z: 0 }, // 保存当前旋转值
      currentTranslation: { x: 0, y: 0, z: 0 }, // 保存当前平移值
      id: rays.value.length
    };
    
    // 添加到场景和射线数组
    scene.add(rayGroup);
    rays.value.push(rayGroup);
    
    return rayGroup;
  }
  
  // 设置激活工具
  function setActiveTool(tool) {
    activeTool.value = tool;
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
  
  // 更新射线位置
  function updateRayPosition() {
    if (!selectedRay.value) return;
    
    selectedRay.value.position.set(
      selectedRay.value.userData.originalPosition.x + translate.value.x,
      selectedRay.value.userData.originalPosition.y + translate.value.y,
      selectedRay.value.userData.originalPosition.z + translate.value.z
    );
  }
  
    // 更新射线旋转
    function updateRayRotation() {
        if (!selectedRay.value) return;
        
        const rx = THREE.MathUtils.degToRad(rotate.value.x || 0);
        const ry = THREE.MathUtils.degToRad(rotate.value.y || 0);
        const rz = THREE.MathUtils.degToRad(rotate.value.z || 0);
        
        // 应用旋转（基于原始旋转）
        selectedRay.value.rotation.copy(selectedRay.value.userData.originalRotation);
        selectedRay.value.rotation.x += rx;
        selectedRay.value.rotation.y += ry;
        selectedRay.value.rotation.z += rz;
    }
  
  // 更新射线长度 - 针对ArrowHelper的实现
  function updateRayLength() {
    const length = rayLength.value || 1.0;
    if (length <= 0) return;
    
    // 更新所有射线的长度
    rays.value.forEach(ray => {
      // ArrowHelper是组中的第一个子元素
      const arrowHelper = ray.children[0];
      if (arrowHelper instanceof THREE.ArrowHelper) {
        // 更新箭头长度
        arrowHelper.setLength(
          length, 
          length * 0.15, // 箭头长度（占总长度的15%）
          length * 0.08  // 箭头宽度（占总长度的8%）
        );
      }
    });
  }
  
  // 重置射线变换
  function resetRayTransform() {
    if (!selectedRay.value) return;
    
    // 重置位置和旋转
    selectedRay.value.position.copy(selectedRay.value.userData.originalPosition);
    selectedRay.value.rotation.copy(selectedRay.value.userData.originalRotation);
    
    // 重置保存的变换状态
    selectedRay.value.userData.currentRotation = { x: 0, y: 0, z: 0 };
    selectedRay.value.userData.currentTranslation = { x: 0, y: 0, z: 0 };
    
    // 重置输入框
    resetTransformInputs();
  }
  
  // 删除选中的射线
  function deleteSelectedRay() {
    if (!selectedRay.value) return;
    
    if (confirm('确定要删除这条射线吗？')) {
      const index = rays.value.indexOf(selectedRay.value);
      if (index !== -1) {
        // 从场景和数组中移除
        scene.remove(selectedRay.value);
        rays.value.splice(index, 1);
        
        // 重新编号
        rays.value.forEach((ray, i) => {
          ray.userData.id = i;
        });
        
        // 取消选择
        selectedRay.value = null;
      }
    }
  }
  
  // 删除所有射线
  function deleteAllRays() {
    if (rays.value.length === 0) return;
    
    if (confirm(`确定要删除所有 ${rays.value.length} 条射线吗？`)) {
      clearAllRays();
      selectedRay.value = null;
    }
  }
  
  // 清除所有射线
  function clearAllRays() {
    rays.value.forEach(ray => {
      scene.remove(ray);
    });
    rays.value = [];
  }
  
  // 重置视图
  function resetView() {
    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    controls.reset();
  }
  
  // 调整相机以显示所有射线
  function fitCameraToRays() {
    if (rays.value.length === 0) return;
    
    // 计算所有射线的边界框
    const box = new THREE.Box3();
    
    rays.value.forEach(ray => {
      box.expandByObject(ray);
    });
    
    // 计算中心点
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // 计算对角线长度
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    
    // 稍微拉远一点
    cameraZ *= 1.5;
    
    // 设置相机位置
    camera.position.z = cameraZ;
    camera.position.y = cameraZ * 0.5;
    camera.position.x = cameraZ * 0.5;
    
    // 看向中心点
    camera.lookAt(center);
    
    // 更新控制器
    controls.target.copy(center);
    controls.update();
  }
  
  // 格式化向量显示
  function formatVector(vector) {
    return [vector.x, vector.y, vector.z].map(v => v.toFixed(2)).join(', ');
  }
  
  // 计算并格式化射线方向
  function formatDirection(rayGroup) {
    // 从ArrowHelper获取方向
    if (rayGroup.children[0] instanceof THREE.ArrowHelper) {
      const direction = new THREE.Vector3();
      rayGroup.children[0].getWorldDirection(direction);
      return [direction.x, direction.y, direction.z].map(v => v.toFixed(2)).join(', ');
    }
    return "0.00, 0.00, 0.00";
  }
  
  // 监听变换数据变化
  watch(translate, updateRayPosition, { deep: true });
  watch(rotate, updateRayRotation, { deep: true });
  watch(rayLength, updateRayLength);
  
  // 组件挂载时初始化
  onMounted(() => {
    initThreeJS();
    bindEvents();
    console.log("fileInput=>",fileInput);
  });
  
    // 组件卸载时清理
    onUnmounted(() => {
        if (animationId) {
        cancelAnimationFrame(animationId);
        }
        
        window.removeEventListener('resize', handleWindowResize);
        
        if (renderCanvas.value) {
        renderCanvas.value.removeEventListener('click', onCanvasClick);
        }
        
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
  