<template>
    <div class="flex flex-col h-screen bg-gray-100 overflow-hidden">
        <!-- flex容器确保两栏按比例分配宽度 -->
        <div class="flex flex-1 overflow-hidden">
            <!-- 左侧栏：占20% (1/5) -->
            <div class="w-64 bg-white shadow-lg p-4 flex flex-col transition-all duration-300 transform z-10 overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-semibold">3D模型在线查看</h2>
                </div>
                
                <!-- File Upload Area -->
                <!--模型文件-->
                <div class="border-gray-200">
                    <h2 class="text-lg font-semibold mb-3">文件操作</h2>
                    
                    <!-- 未上传文件时显示的上传区域 -->
                    <div v-show="!modelFileName" class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                        @click="triggerModelFileInput"
                        @dragover.prevent @dragenter.prevent @dragleave.prevent
                        @drop.prevent="handleDropModelFile">
                        <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-3"></i>
                        <p class="text-sm text-gray-600 mb-2">点击或拖拽模型文件到此处上传</p>
                        <p class="text-xs text-gray-400">支持的格式: .stl .obj</p>
                        <input type="file" id="file-input" ref="modelFileInput" accept=".stl,.obj" class="hidden" @change="handleFileUpload">
                    </div>
                    
                    <!-- 已上传文件时显示的文件信息 -->
                    <div v-show="modelFileName" class="bg-gray-50 rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex items-center">
                            <i class="fa fa-file-text-o text-blue-500 mr-2 mt-0.5"></i>
                            <span class="text-sm truncate max-w-[160px]" :title="modelFileName">{{ modelFileName }}</span>
                            </div>
                            <button @click="clearUploadedFile" class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="fa fa-times"></i>
                            </button>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="reloadModelFile" class="flex-1 bg-gray-200 text-gray-700 text-xs p-1.5 rounded transition-all hover:bg-gray-300">
                            <i class="fa fa-refresh mr-1"></i>重新加载
                            </button>
                            <button @click="triggerModelFileInput" class="flex-1 bg-blue-500 text-white text-xs p-1.5 rounded transition-all hover:bg-blue-600">
                            <i class="fa fa-exchange mr-1"></i>更换文件
                            </button>
                        </div>
                    </div>
                </div>
                <!--verts文件-->
                <div class="mb-6 pb-4 border-b border-gray-200" v-show="modelLoaded">
                    <!-- 未上传文件时显示的上传区域 -->
                    <div v-show="!vertsFileName" class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                        @click="triggerVertsFileInput"
                        @dragover.prevent @dragenter.prevent @dragleave.prevent
                        @drop.prevent="handleDropVertsFile">
                        <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-3"></i>
                        <p class="text-sm text-gray-600 mb-2">点击或拖拽.verts文件到此处上传</p>
                        <p class="text-xs text-gray-400">支持的格式: .verts</p>
                        <input type="file" id="file-input" ref="vertsFileInput" accept=".verts" class="hidden" @change="handleFileUpload">
                    </div>
                    
                    <!-- 已上传文件时显示的文件信息 -->
                    <div v-show="vertsFileName" class="bg-gray-50 rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex items-center">
                                <i class="fa fa-file-text-o text-blue-500 mr-2 mt-0.5"></i>
                                <span class="text-sm truncate max-w-[160px]" :title="vertsFileName">{{ vertsFileName }}</span>
                            </div>
                            <button @click="clearUploadedFile" class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="fa fa-times"></i>
                            </button>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="reloadVertsFile" class="flex-1 bg-gray-200 text-gray-700 text-xs p-1.5 rounded transition-all hover:bg-gray-300">
                                <i class="fa fa-refresh mr-1"></i>重新加载
                            </button>
                            <button @click="triggerVertsFileInput" class="flex-1 bg-blue-500 text-white text-xs p-1.5 rounded transition-all hover:bg-blue-600">
                                <i class="fa fa-exchange mr-1"></i>更换文件
                            </button>
                        </div>
                    </div>
                </div>
                
                <n-collapse>
                    <n-collapse-item title="模型控制" name="1" v-show="modelLoaded">
                        <!-- Model Controls -->
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-sm font-medium text-gray-700 mb-3">Appearance</h3>
                                
                                <div class="space-y-4">
                                    <!-- Color Picker -->
                                    <div>
                                        <label class="block text-xs text-gray-500 mb-1">Model Color</label>
                                        <div class="flex items-center space-x-2">
                                            <input type="color" v-model="modelColor" class="w-8 h-8 p-0 border-0" @change="updateModelColor">
                                            <span class="text-sm">{{ modelColor.toUpperCase() }}</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Wireframe Toggle -->
                                    <div class="flex items-center justify-between">
                                        <label class="text-sm">Wireframe</label>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <n-switch v-model:value="isWireframe" @update:value="toggleWireframe" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="text-sm font-medium text-gray-700 mb-3">Scene</h3>
                                
                                <div class="space-y-4">
                                    <!-- Background Color -->
                                    <div>
                                        <label class="block text-xs text-gray-500 mb-1">Background Color</label>
                                        <div class="flex items-center space-x-2">
                                            <input type="color" v-model="bgColor" class="w-8 h-8 p-0 border-0" @change="updateBackgroundColor">
                                            <span class="text-sm">{{ bgColor.toUpperCase() }}</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Axis Toggle -->
                                    <div class="flex items-center justify-between">
                                        <label class="text-sm">显示坐标轴</label>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <n-switch v-model:value="isShowAxis" @update:value="showAxis" />
                                        </label>
                                    </div>

                                    <!-- Reset Camera -->
                                    <button class="w-full py-2 px-3 bg-gray-200 rounded-md text-sm transition-colors duration-200 flex items-center justify-center space-x-1" @click="resetCamera">
                                        <i class="fa fa-refresh"></i>
                                        <span>Reset View</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </n-collapse-item>
                    <n-collapse-item title="射线控制" name="2" v-if="selectedRay">
                        <div class="space-y-4">
                            <!-- Normal Length -->
                            <div>
                                <label class="text-sm">法线长度</label>
                                <div class="flex items-center space-x-2">
                                    <n-slider v-model:value="normalLength" :min="1" :max="20" @dragend="normalLengthUpdate"/>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-medium mb-2 text-sm text-gray-600">射线信息</h3>
                                <div class="bg-gray-50 p-3 rounded-md text-sm">
                                <p><span class="text-gray-500">ID:</span> {{ selectedRay.userData.id }}</p>
                                <p><span class="text-gray-500">起点:</span> ({{ formatVector(selectedRay.position) }})</p>
                                <p><span class="text-gray-500">方向:</span> ({{ formatDirection(selectedRay) }})</p>
                                </div>
                            </div>
                        
                            <!--偏移控制-->
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
                            
                            <!--旋转控制-->
                            <div>
                                <h3 class="font-medium mb-2 text-sm text-gray-600">旋转控制</h3>
                                <div class="grid grid-cols-3 gap-2">
                                <div class="flex flex-col">
                                    <label class="text-xs text-gray-500 mb-1">X轴</label>
                                    <input type="number" v-model.number="rotate.x" step="1" class="text-sm border border-gray-300 rounded px-2 py-1">
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-xs text-gray-500 mb-1">Y轴</label>
                                    <input type="number" v-model.number="rotate.y" step="1" class="text-sm border border-gray-300 rounded px-2 py-1">
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-xs text-gray-500 mb-1">Z轴</label>
                                    <input type="number" v-model.number="rotate.z" step="1" class="text-sm border border-gray-300 rounded px-2 py-1">
                                </div>
                                </div>
                            </div>

                            <div class="flex space-x-2">
                                <button @click="resetRayTransform" class="flex-1 bg-gray-200 text-gray-700 p-2 rounded-md text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                                <i class="fa fa-refresh mr-1"></i>重置
                                </button>
                                <button @click="deleteSelectedRay" class="flex-1 bg-red-500 text-white p-2 rounded-md text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                                <i class="fa fa-trash mr-1"></i>删除
                                </button>
                                <button @click="exportVertsFile" class="flex-1 bg-red-500 text-white p-2 rounded-md text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                                <i class="fa fa-trash mr-1"></i>导出
                                </button>
                            </div>
                        </div>
                    </n-collapse-item>
                    <n-collapse-item title="场景信息" name="3">
                        <!-- 场景信息 -->
                        <div class="mt-auto pt-4 border-gray-200">
                            <h3 class="font-medium mb-2 text-sm text-gray-600">场景信息</h3>
                            <div class="bg-gray-50 p-3 rounded-md text-sm">
                            <p><span class="text-gray-500">射线总数:</span> {{ rays.length }}</p>
                            <p><span class="text-gray-500">选中射线:</span> {{ selectedRay ? 1 : 0 }}</p>
                            </div>
                        </div>
                    </n-collapse-item>
                </n-collapse>
            </div>
            
            <!-- 右侧栏：占80% (4/5) -->
            <div class="flex-1 relative" >
                <div ref="rightContainer" style="width: 100%;height: 100%;">
                    <div ref="canvasContainer" ></div>
                    <!-- 操作提示 -->
                    <div class="absolute bottom-4 left-4 bg-gray-800/80 text-white px-4 py-2 rounded-md text-sm backdrop-blur-sm">
                        <p class="mb-1"><i class="fa fa-info-circle mr-1"></i>操作提示:</p>
                        <ul class="list-disc list-inside text-xs space-y-0.5">
                        <li>左键拖动: 旋转视图</li>
                        <li>右键拖动: 平移视图</li>
                        <li>滚轮: 缩放视图</li>
                        <li>点击射线: 选择射线</li>
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
            </div>
        </div>
    </div>

</template>

<script setup>
    import { ref, onMounted, onUnmounted,watch } from 'vue'

    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { STLLoader } from 'three/addons/loaders/STLLoader.js';

    import { useMessage } from "naive-ui";
import { SecurityRound } from '@vicons/material';
    const message = useMessage();

    const isLoading = ref(false);

    let modelLoaded = ref(false)
    const modelFileName = ref(''); // 存储上传的文件名
    const modelFile = ref(null); // 存储当前上传的文件对象
    let vertsLoaded = ref(false)
    const vertsFileName = ref(''); // 存储上传的文件名
    const vertsFile = ref(null); // 存储当前上传的文件对象

    const modelFileInput = ref(null)
    const vertsFileInput = ref(null)
    const rightContainer = ref(null)
    const canvasContainer = ref(null)
    let modelColor = ref('#c0c0c0');
    let bgColor = ref('#1B5050')
    let isWireframe = ref(false)

    let scene, camera, renderer,controls,model,directionalLight;
    let raycaster,mouse;
    let axizLength = 15;

    const selectedRay = ref(null);

    // 变换控制
    const translate = ref({ x: 0, y: 0, z: 0 });
    const rotate = ref({ x: 0, y: 0, z: 0 });

    //法线相关数据
    let originNormals = {
        verts :[],
        normals:[]
    }

    let loadedNormals = {
        position:[],
        direction:[],
        flags:[]//0 正常 1 已删除
    }

    let rays = ref([]);
    let normalColor = ref('#3B82F6')
    let normalSelectedColor = ref('#8B5CF6')

    // 窗口大小变化处理
    function onWindowResize() {
        if (!canvasContainer.value) return;
        
        // const width = canvasContainer.value.clientWidth;
        // const height = canvasContainer.value.clientHeight;
        
        const width = rightContainer.value.clientWidth;
        const height = rightContainer.value.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        //console.log(`onWindowResize=>canvasContainer.value.clientWidth:${width},canvasContainer.value.clientHeight:${height}`)
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
        
        // 取消之前选中的射线
        deselectRay();
        
        // 设置新的选中射线
        selectedRay.value = rayGroup;
        
        console.log("selectedRay.value=>",selectedRay.value)
        // 更改选中射线的颜色
        rayGroup.children.forEach(child => {
            if (child.material) {
                child.material.color.set(normalSelectedColor.value); // 紫色表示选中
            }
            else{
                console.log("update selected ray arrow color")
                child.setColor(new THREE.Color(normalSelectedColor.value))
            }
        });
        
        // 加载新选中射线的变换状态
        loadRayTransform(rayGroup);
    }

    // 取消选择射线
    function deselectRay() {
        if (selectedRay.value) {
            // 保存当前选中射线的变换状态
            saveRayTransform(selectedRay.value);

            // 恢复射线原来的颜色
            selectedRay.value.children.forEach(child => {
                if (child.material) {
                    child.material.color.set(normalColor.value); // 恢复蓝色
                }
                else{
                    child.setColor(new THREE.Color(normalColor.value)); // 恢复蓝色
                }
            });
            
            selectedRay.value = null;
            console.log("deselect ray")
        }
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

    // 重置变换输入
    function resetTransformInputs() {
        translate.value = { x: 0, y: 0, z: 0 };
        rotate.value = { x: 0, y: 0, z: 0 };
    }

    function onCanvasClick(event) {
        if (!raycaster || !camera) return;
    
        // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
        const rect = rightContainer.value.getBoundingClientRect();
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
                //deselectRay();
            }
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
                console.log("remove ray index=>",index);
                // 从场景和数组中移除
                scene.remove(selectedRay.value);
                //从ray数组中移除
                rays.value.splice(index, 1);

                // 递归移除组内所有子对象
                while (selectedRay.value.children.length > 0) {
                    const child = selectedRay.value.children[0];
                    selectedRay.value.remove(child);
                    // 若子对象是网格，可释放几何体和材质（根据需求）
                    if (child.isMesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                }

                
                //标记某个法线已经被删除
                loadedNormals.flags[selectedRay.value.userData.id] = 1;
                
                // 取消选择
                selectedRay.value = null;
            }
        }
    }

    // 初始化场景
    function initScene() {
        scene = new THREE.Scene()
        scene.background = new THREE.Color(bgColor.value)
    }
    
    function initAxesHelper() {
        //let axesHelper = new THREE.AxesHelper(5)
        //scene.add(axesHelper)
    }

    let arrowX,arrowY,arrowZ;

    const isShowAxis = ref(true);
    //是否显示坐标轴
    function showAxis(isShow) {
        //message.info(`Update value: ${value}`);
        if(isShow)
        {
            scene.add(arrowX);
            scene.add(arrowY);
            scene.add(arrowZ);
        }
        else{
            scene.remove(arrowX);
            scene.remove(arrowY);
            scene.remove(arrowZ);
        }
    }

    //箭头辅助器
    function initArrowHelper()
    {
        // 3. 箭头辅助器
        //X轴 红色
        arrowX = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            axizLength,
            0xff0000,
            0.5,
            0.3
        );
        

        //Y轴 绿色
        arrowY = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            axizLength,
            0x00ff00,
            0.5,
            0.3
        );
        

        //Z轴 蓝色
        arrowZ = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            axizLength,
            0x0000ff,
            0.5,
            0.3
        );
        

        if(isShowAxis.value)
        {
            scene.add(arrowX);
            scene.add(arrowY);
            scene.add(arrowZ);
        }
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,100)
        camera.position.set(1.5,1.5,1.5)
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({antialias:true})
        renderer.setPixelRatio(window.devicePixelRatio)
        const width = rightContainer.value.clientWidth;
        const height = rightContainer.value.clientHeight;
        renderer.setSize(width,height)
        canvasContainer.value.appendChild(renderer.domElement)
        console.log(`InitRender=>window.innerWidth:${window.innerWidth},window.innerHeight:${window.innerHeight}`)
    }

    //初始化灯光
    function initLight() {
        directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 10, 10)
        scene.add(directionalLight);
    }

    function initControls() { 
        let useOrbitControl = false;
        if(useOrbitControl)
        {
            controls = new OrbitControls(camera, renderer.domElement)

            // 如果使用animate方法时，将此函数删除
            //controls.addEventListener( 'change', render );

            // 解除垂直旋转限制（允许360度翻转）
            controls.minPolarAngle = 0; // 最小垂直角度
            controls.maxPolarAngle = Math.PI; // 最大垂直角度，默认值，可以根据需要调整

            // 解除水平旋转限制（如果设置了的话）
            controls.minAzimuthAngle = -Infinity; // 最小水平角度
            controls.maxAzimuthAngle = Infinity;  // 最大水平角度
            // 使动画循环使用时阻尼或自转 意思是否有惯性
            controls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            controls.dampingFactor = 0.05;
            //是否可以缩放
            controls.enableZoom = true;
            //是否自动旋转
            controls.autoRotate = false;
            //设置相机距离原点的最远距离
            controls.minDistance  = 20;
            //设置相机距离原点的最远距离
            controls.maxDistance  = 10000;
            //是否开启右键拖拽
            controls.enablePan = true;
        }
        else
        {
            console.log("Init trackball controls")

            controls = new TrackballControls(camera, renderer.domElement);
            
            // 配置控制器参数
            controls.rotateSpeed = 4.0    // 旋转速度
            controls.zoomSpeed = 1.2      // 缩放速度
            controls.panSpeed = 1.0       // 平移速度
            
            controls.noZoom = false       // 允许缩放
            controls.noPan = false        // 允许平移
            controls.noRotate = false     // 允许旋转
            
            controls.staticMoving = true // 禁用静态移动（禁用惯性）
            controls.dynamicDampingFactor = 0.05 // 动态阻尼系数

            // 调试用：监听控制器变化
            controls.addEventListener('change', () => {
                //console.log('控制器状态变化')
                renderer.render(scene, camera)
            })
        }
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate)
        
        // cube.rotation.x += 0.01
        // cube.rotation.y += 0.01
        controls.update();

        // 克隆相机位置
        const vector = camera.position.clone();
        // 将相机位置赋值给光源
        directionalLight.position.set(vector.x, vector.y, vector.z);

        renderer.render(scene, camera)
    }
    
    function initMesh() {
        
    }

    // 使模型适应渲染区域的函数
    function fitModelToRenderer() {
        if (!model) return;
        console.log("fit model to renderer")
        // 计算模型的边界框
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = new THREE.Vector3(0,0,0);//box.getCenter(new THREE.Vector3());
        
        console.log("model size=>",size);
        console.log("model position=>",model.position);
        // 将模型居中
        {
            //测试计算模型边界
            const tempBox = new THREE.Box3();
            tempBox.expandByObject(model);
            console.log("box=>",tempBox);
        }

        //这个position指的是模型原点相对于场景原点的位置
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        console.log("model position=>",model.position);

        {
            //测试计算模型边界
            let geo = model.geometry;
            geo.computeBoundingBox()
            console.log("geo.boundingBox",geo.boundingBox);
        }
        // 计算模型的最大尺寸
        const maxDim = Math.max(size.x, size.y, size.z);
        
        console.log("maxDim=>",maxDim);

        // 计算相机到模型的距离（基于视场角）
        //角度转弧度
        const fov = camera.fov * (Math.PI / 180);
        //取中点 用三角函数计算相机距离模型的距离
        let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));
        
        // 稍微增加距离，让模型不贴边
        cameraZ *= 1.1;
        
        console.log("cameraZ=>",cameraZ);

        // 设置相机位置
        camera.position.z = cameraZ;
        
        console.log("camera.position=>",camera.position);

        camera.lookAt(0, 0, 0);

        // 调整相机的近裁面和远裁面
        const minZ = Math.min(0.1, cameraZ - maxDim * 0.5);
        const maxZ = Math.max(cameraZ * 2, cameraZ + maxDim * 0.5);
        camera.near = minZ;
        camera.far = maxZ;
        camera.updateProjectionMatrix();
    }

    // Center model in view
    function centerModel() {
        console.log("Call centerModel");
        if (!model) return;
        
        // Compute bounding box
        model.geometry.computeBoundingBox();
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        // Center the model
        model.position.sub(center);
        
        // Adjust camera to frame the model
        const size = box.getSize(new THREE.Vector3());
        console.log("box size=>",size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        // Add some padding
        cameraZ *= 1.5;
        
        camera.position.z = cameraZ;
        
        // Reset controls
        controls.reset();
    }

    //是否显示面片
    function toggleWireframe() {
        if (model) {
            model.material.wireframe = isWireframe.value;
        }
    }
    
    function resetCamera() {
        controls.reset();
    }

    function loadSTLFile(file) {
        console.log("load stl file");
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                // Remove existing model if present
                if (model) {
                    scene.remove(model);
                    model.geometry.dispose();
                    model.material.dispose();
                    model = null;
                }
                
                console.log("reader on load");
                // Load STL data
                const loader = new STLLoader();
                if(true)
                {
                    const geometry = loader.parse(event.target.result);
                
                    // Create material
                    const material = new THREE.MeshPhongMaterial({
                        color: modelColor.value,
                        wireframe: isWireframe,
                        side: THREE.DoubleSide
                    });

                    // Create mesh and add to scene
                    model = new THREE.Mesh(geometry, material);
                    //model = new THREE.Mesh(geometry);
                }
                else
                {
                    const geometry = await loader.loadAsync( './1641922.stl' )
                    model = new THREE.Mesh(geometry);
                }

                scene.add(model);

                // Center the model
                centerModel();
                
                fitModelToRenderer();

                modelLoaded.value = true;
                
            } catch (error) {
                console.error('Error loading STL file:', error);
                alert('Failed to load STL file. Please try another file.');
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    function loadOBJFile(file) {
        console.log("load OBJ file");
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                // Remove existing model if present
                if (model) {
                    scene.remove(model);
                    model.geometry.dispose();
                    model.material.dispose();
                    model = null;
                }
                
                console.log("reader on load");
                // Load OBJ data
                const loader = new OBJLoader();

                if(true)
                {
                    // Create material
                    const material = new THREE.MeshPhongMaterial({
                        color: modelColor.value,
                        wireframe: isWireframe,
                        side: THREE.DoubleSide
                    });
                    var decoder = new TextDecoder("utf-8");
                    console.log("input obj data=>",event.target.result);
                    model = loader.parse(decoder.decode(event.target.result)).children[0];
                    model.material = material;
                    console.log("OBJ model=>",model);
                }
                else
                {
                    const object = await loader.loadAsync( './attmesh_0.obj' );
                    model = object;
                }
                console.log("load OBJ file=>",model);
                scene.add(model);

                // Center the model
                centerModel();
                
                fitModelToRenderer()

                modelLoaded.value = true;
                
            } catch (error) {
                console.error('Error loading OBJ file:', error);
                alert('Failed to load OBJ file. Please try another file.');
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    let normalLength = ref(10.0)

    //更改法线长度
    function normalLengthUpdate()
    {
        const length = normalLength.value || 1.0;
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

        // for(let normal of rays.value)
        // {
        //     normal.setLength(normalLength.value);
        // }
    }

    // 更新射线位置
    function updateRayPosition() {
        if (!selectedRay.value) return;
        
        console.log("update ray position")
        selectedRay.value.position.set(
            selectedRay.value.userData.originalPosition.x + translate.value.x,
            selectedRay.value.userData.originalPosition.y + translate.value.y,
            selectedRay.value.userData.originalPosition.z + translate.value.z
        );

        loadedNormals.position[selectedRay.value.userData.id] = selectedRay.value.position;
    }

    // 更新射线旋转
    function updateRayRotation() {
        if (!selectedRay.value) return;
        console.log("update ray rotation,rotate.value=>",rotate.value);
        //角度转弧度
        const rx = THREE.MathUtils.degToRad(rotate.value.x || 0);
        const ry = THREE.MathUtils.degToRad(rotate.value.y || 0);
        const rz = THREE.MathUtils.degToRad(rotate.value.z || 0);

        let curIndex = selectedRay.value.userData.id
        //必须clone，否则会影响原值
        let vec = originNormals.normals[curIndex].clone();
        vec.normalize();

        var euler = new THREE.Euler(rx,ry,rz,'ZYX'); 
        vec.applyEuler(euler).normalize();
        loadedNormals.direction[curIndex] = vec;

        // 应用旋转（基于原始旋转）
        selectedRay.value.rotation.copy(selectedRay.value.userData.originalRotation);
        selectedRay.value.rotation.x += rx;
        selectedRay.value.rotation.y += ry;
        selectedRay.value.rotation.z += rz;
    }

    // 保存射线的变换状态
    function saveRayTransform(rayGroup) {
        console.log("saveRayTransform=>",rotate)
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
        console.log("loadRayTransform=>",rayGroup.userData.currentRotation)
        console.log("before loaded rotate.value=>",rotate.value)
        // 加载保存的旋转值，如果没有则使用0
        if (rayGroup.userData.currentRotation) {
            rotate.value = { ...rayGroup.userData.currentRotation };
        } else {
            rotate.value = { x: 0, y: 0, z: 0 };
        }
        console.log("after loaded rotate.value=>",rotate.value)
        // 加载保存的平移值，如果没有则使用0
        if (rayGroup.userData.currentTranslation) {
            translate.value = { ...rayGroup.userData.currentTranslation };
        } else {
            translate.value = { x: 0, y: 0, z: 0 };
        }
        console.log("loadRayTransform leave rotate.value=>",rotate.value)
    }

    //将法线显示到场景中
    function addNormalsToScene(inputNormals)
    {
        if(inputNormals.verts.length != inputNormals.normals.length)
        {
            return;
        }

        for (let i=0;i<inputNormals.verts.length;i++) 
        {
            const arrow = new THREE.ArrowHelper(
                inputNormals.normals[i],// 方向
                new THREE.Vector3(0, 0, 0), // 起点（相对于组）
                normalLength.value,// 长度
                normalColor.value,// 颜色
                normalLength.value * 0.15,// 箭头长度（占总长度的15%）
                normalLength.value * 0.08// 箭头宽度（占总长度的8%）
            );
            // 创建射线起点的标记点
            const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const pointMaterial = new THREE.MeshBasicMaterial({ color: normalColor.value });
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            
            // 创建一个组来包含射线的所有部分
            const rayGroup = new THREE.Group();
            rayGroup.add(arrow);
            rayGroup.add(point);
            // 设置射线的初始位置（箭头辅助器的位置由组控制）
            rayGroup.position.copy(inputNormals.verts[i]);

            loadedNormals.position.push(new THREE.Vector3().copy(inputNormals.verts[i]));
            loadedNormals.direction.push(new THREE.Vector3().copy(inputNormals.normals[i]));
            loadedNormals.flags.push(1);

            // 存储射线的原始数据和当前变换状态
            rayGroup.userData = {
                originalPosition: new THREE.Vector3().copy(inputNormals.verts[i]),
                originalDirection: new THREE.Vector3().copy(inputNormals.normals[i]),
                originalRotation: new THREE.Euler().copy(rayGroup.rotation),
                currentRotation: { x: 0, y: 0, z: 0 }, // 保存当前旋转值
                currentTranslation: { x: 0, y: 0, z: 0 }, // 保存当前平移值
                id: rays.value.length
            };

            scene.add(rayGroup);
            rays.value.push(rayGroup);
        }
        vertsLoaded.value = true;
    }

    /*
    * 解析法线数据
    * lines Array
    */
    function loadNormals(fileContent)
    {
        originNormals.verts = [];
        originNormals.normals = [];

        const lines = fileContent.trim().split(/[\r\n]+/);

        //逐行解析
        lines.forEach(
            function(line){
                const lineElem = line.trim().split(" ")
                console.log("lineElem.length=>",lineElem.length)
                if(lineElem.length >= 4)
                {
                    //解析点
                    if(lineElem[0] == 'v' || lineElem[0] == 'V')
                    {
                        originNormals.verts.push(
                            new THREE.Vector3(
                                parseFloat(lineElem[1]),
                                parseFloat(lineElem[2]),
                                parseFloat(lineElem[3])
                            )
                        )
                    }
                    //解析法线
                    if(lineElem[0] == 'vn')
                    {
                        originNormals.normals.push(
                            new THREE.Vector3(
                                parseFloat(lineElem[1]),
                                parseFloat(lineElem[2]),
                                parseFloat(lineElem[3])
                            )
                        )
                    }
                }
            }
        )

        addNormalsToScene(originNormals);
    }

    function loadVertsFile(file){
        console.log("load Verts file");
        if (!model) {
            console.log("model not exist");
            message.warning("请先选择模型文件 加载模型");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                //读取成功 解析法线数据
                loadNormals(event.target.result);
            } catch (error) {
                console.error('Error loading Verts file:', error);
                alert('Failed to load Verts file. Please try another file.');
            }
        };
        
        reader.readAsText(file);
    }

    function reloadModelFile()
    {
        if(modelFile.value)
        {
            processFile(modelFile);
        }
    }

    function reloadVertsFile()
    {
        if(vertsFile.value)
        {
            processFile(vertsFile)
        }
    }

    function processFile(file){
         // Check file type
         if (file.name.toLowerCase().endsWith('.stl')) {
            modelFileName.value = file.name;
            modelFile.value = file;
            isLoading.value = true;
            loadSTLFile(file);
            isLoading.value = false;
        }
        else if (file.name.toLowerCase().endsWith('.obj')) {
            modelFileName.value = file.name;
            modelFile.value = file;
            isLoading.value = true;
            loadOBJFile(file);
            isLoading.value = false;
        }
        else if (file.name.toLowerCase().endsWith('.verts')) {
            vertsFileName.value = file.name;
            vertsFile.value = file;
            isLoading.value = true;
            loadVertsFile(file);
            isLoading.value = false;
        }
    }

    // 触发文件选择对话框
    function triggerModelFileInput() {
        modelFileInput.value.click();
    }

    function triggerVertsFileInput() {
        vertsFileInput.value.click();
    }

    // 处理拖放文件
    function handleDropModelFile(event) {
        const file = event.dataTransfer.files[0];
        if (!file) return;
        
        // 检查文件类型
        if (file.name.toLowerCase().endsWith('.stl') || file.name.toLowerCase().endsWith('.obj')) {
            processFile(file);
        } else {
            alert('请上传stl或obj格式的文件');
        }
    }

    function handleDropVertsFile(event) {
        const file = event.dataTransfer.files[0];
        if (!file) return;
        
        // 检查文件类型
        if (file.name.toLowerCase().endsWith('.verts')) {
            processFile(file);
        } else {
            alert('请上传.verts格式的文件');
        }
    }

    //文件上传
    function handleFileUpload(event) {
        const file = event.target.files[0];
        console.log("call handle file upload=>",event.target.files[0]);
        if (!file) return;
        
        processFile(file);
    }

    //更改场景颜色
    function updateBackgroundColor()
    {
        scene.background.set(bgColor.value);
    }

    //更改模型颜色
    function updateModelColor()
    {
        if (model) {
            model.material.color.set(modelColor.value);
        }
    }

    // 导出verts文件
    function exportVertsFile() {
        if (rays.value.length === 0) {
            alert('没有可导出的射线数据');
            return;
        }
        
        let content = '';
        
        let verts = [];
        let normals = [];
        
        // 遍历所有射线，收集变换后的起点和方向
        rays.value.forEach(rayGroup => {
            let curIndex = rayGroup.userData.id;
            verts.push(loadedNormals.position[curIndex]);
            normals.push(loadedNormals.direction[curIndex]);

            //content += `v ${origin.x.toFixed(4)} ${origin.y.toFixed(4)} ${origin.z.toFixed(4)}\n`;
            //content += `vn ${direction.x.toFixed(4)} ${direction.y.toFixed(4)} ${direction.z.toFixed(4)}\n`;
        });

        for(let i=0;i<verts.length;i++)
        {
            let origin = verts[i];

            // 按照.verts格式添加行，保留4位小数精度
            content += `v ${origin.x.toFixed(4)} ${origin.y.toFixed(4)} ${origin.z.toFixed(4)}\n`;
        }

        for(let i=0;i<normals.length;i++)
        {
            let direction = normals[i];

            // 按照.verts格式添加行，保留6位小数精度
            content += `vn ${direction.x.toFixed(6)} ${direction.y.toFixed(6)} ${direction.z.toFixed(6)}\n`;
        }

        // 创建Blob并下载文件
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        // 使用原始文件名加上"_modified"后缀，或者默认名称
        const baseName = vertsFileName.value ? 
        vertsFileName.value.replace('.verts', '_modified.verts') : 
            'modified_rays.verts';
        a.download = baseName;
        
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

      // 监听变换数据变化
    watch(translate, updateRayPosition, { deep: true });
    watch(rotate, updateRayRotation, { deep: true });

    onMounted(() => {
        // 初始化场景
        initScene()
        // 初始化辅助轴
        initAxesHelper()
        //
        initArrowHelper()
        // 初始化灯光
        initLight()
        // 初始化mesh
        initMesh()
        // 初始化相机
        initCamera()
        // 初始化渲染器
        initRenderer()
        // 初始化轨道控制器
        initControls()
        // 循环动画
        animate()

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        window.addEventListener('resize', onWindowResize);
        // 射线交互事件
        window.addEventListener('click', onCanvasClick);
    })
    
    // 组件卸载时清理资源
    onUnmounted(() => {
        window.removeEventListener('resize', onWindowResize);
        // 射线交互事件
        window.removeEventListener('click', onCanvasClick);
        if (renderer) {
            renderer.dispose()
        }
    })
</script>