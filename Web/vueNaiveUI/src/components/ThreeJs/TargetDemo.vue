<template>
    <div class="m-0 p-0 w-full h-screen overflow-hidden">
        <!-- flex容器确保两栏按比例分配宽度 -->
        <div class="flex w-full h-full">
            <!-- 左侧栏：占20% (1/5) -->
            <div class="flex-[1] h-full bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
                <!-- <aside class="bg-white w-full shadow-lg p-4 overflow-y-auto transition-all duration-300"> -->
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg font-semibold">3D模型在线查看</h2>
                    </div>
                    
                    <!-- File Upload Area -->
                    <div class="mb-8">
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200 cursor-pointer" @click="fileInput.click()">
                            <input type="file" ref="fileInput" accept=".stl,.obj,.verts" class="hidden" @change="handleFileUpload">
                            <i class="fa fa-cloud-upload text-3xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500">Click to upload </p>
                            <p class="text-xs text-gray-400 mt-1">Supports .stl .obj files</p>
                        </div>
                        
                        <div v-if="selectedFile" class="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <!-- <div class="truncate max-w-[200px]">
                                <p class="text-sm font-medium">{{ selectedFile.name }}</p>
                                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                            </div> -->
                            <button class="text-red-500 hover:text-red-700" @click="clearFile">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Model Controls -->
                    <div v-if="modelLoaded" class="space-y-6">
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
                                        <input type="checkbox" v-model="isWireframe" class="sr-only peer" @change="toggleWireframe">
                                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
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
                                
                                <!-- Wireframe Toggle -->
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
                    
                    <!-- Help Section -->
                    <div v-else class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 class="text-sm font-medium text-blue-800 mb-2">How to Use</h3>
                        <ul class="text-xs text-blue-700 space-y-2">
                            <li class="flex items-start space-x-2">
                                <i class="fa fa-upload mt-1 text-blue-500"></i>
                                <span>Upload an STL file using the upload area above</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <i class="fa fa-mouse-pointer mt-1 text-blue-500"></i>
                                <span>Click and drag to rotate the model</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <i class="fa fa-search-plus mt-1 text-blue-500"></i>
                                <span>Scroll to zoom in and out</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <i class="fa fa-arrows mt-1 text-blue-500"></i>
                                <span>Hold Shift and drag to pan</span>
                            </li>
                        </ul>
                    </div>
                <!-- </aside> -->
            </div>
            
            <!-- 右侧栏：占80% (4/5) -->
            <div class="flex-[4] h-full bg-white p-1 flex flex-col" >
                <div ref="rightContainer" style="width: 100%;height: 100%;">
                    <div ref="canvasContainer" ></div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'

    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { STLLoader } from 'three/addons/loaders/STLLoader.js';

    import { useMessage } from "naive-ui";
    const message = useMessage();

    let isScrolled = ref(false)
    const fileInput = ref(null)
    const rightContainer = ref(null)
    const canvasContainer = ref(null)
    let modelColor = ref('#42a5f5');
    let bgColor = ref('#1B5050')
    let isWireframe = ref(false)

    let scene, camera, renderer,controls, cube,model;
    let axizLength = 15;
    let selectedFile = ref(null)
    let modelLoaded = ref(false)

    function handleScroll() {
        isScrolled.value = window.scrollY > 10;
    }

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

    function initLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 10, 10)
        scene.add(directionalLight);
    }

    function initControls() { 
        controls = new OrbitControls(camera, renderer.domElement)

        // 如果使用animate方法时，将此函数删除
        //controls.addEventListener( 'change', render );
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        //controls.dampingFactor = 0.25;
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

    // 动画循环
    function animate() {
        requestAnimationFrame(animate)
        
        // cube.rotation.x += 0.01
        // cube.rotation.y += 0.01
        
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

    function loadVertsFile(file){
        console.log("load OBJ file");
        if (!model) {
            console.log("model not exist");
            message.warning("请先选择模型文件 加载模型");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                
            } catch (error) {
                console.error('Error loading Verts file:', error);
                alert('Failed to load Verts file. Please try another file.');
            }
        };
        
        reader.readAsText(file);
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        console.log("call handle file upload=>",event.target.files[0]);
        if (!file) return;
        
        // Check file type
        if (file.name.toLowerCase().endsWith('.stl')) {
            selectedFile.value = file;
            loadSTLFile(file);
        }
        else if (file.name.toLowerCase().endsWith('.obj')) {
            selectedFile.value = file;
            loadOBJFile(file);
        }
        else if (file.name.toLowerCase().endsWith('.verts')) {
            selectedFile.value = file;
            loadVertsFile(file);
        }
        
    }

    function updateBackgroundColor()
    {
        scene.background.set(bgColor.value);
    }

    function updateModelColor()
    {
        if (model) {
            model.material.color.set(modelColor.value);
        }
    }

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