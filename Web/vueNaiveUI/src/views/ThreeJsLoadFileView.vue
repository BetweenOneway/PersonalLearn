<template>
    <div class="bg-gray-50 font-inter text-dark min-h-screen flex flex-col">
        <div id="app" class="flex flex-col h-screen">
            <!-- Main Content -->
            <main class="flex-1 flex flex-col md:flex-row">
                <!-- Sidebar -->
                <aside class="bg-white w-full md:w-80 shadow-lg p-4 md:h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300" :class="{ '-translate-x-full md:translate-x-0': !isSidebarOpen, 'translate-x-0': isSidebarOpen }">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg font-semibold">File Controls</h2>
                        <button class="md:hidden text-gray-500 hover:text-gray-700" @click="isSidebarOpen = false">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- File Upload Area -->
                    <div class="mb-8">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Upload STL File</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200 cursor-pointer" @click="fileInput.click()">
                            <input type="file" ref="fileInput" accept=".stl,.obj" class="hidden" @change="handleFileUpload">
                            <i class="fa fa-cloud-upload text-3xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500">Click to upload or drag and drop</p>
                            <p class="text-xs text-gray-400 mt-1">Supports .stl files</p>
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
                                
                                <!-- Reset Camera -->
                                <button class="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors duration-200 flex items-center justify-center space-x-1" @click="resetCamera">
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
                </aside>
                
                <!-- Main Viewer Area -->
                <div class="flex-1 relative bg-gray-100">
                    <!-- Canvas Container -->
                    <div ref="canvasContainer" id="canvas-container" class="w-full h-full absolute top-0 left-0"></div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="bg-dark text-white py-4">
                <div class="container mx-auto px-4 text-center text-sm text-gray-400">
                    <p>STL Viewer &copy; 2023 | Built with Vue and Three.js</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'

    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { STLLoader } from 'three/addons/loaders/STLLoader.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    let isSidebarOpen = ref(true)
    let isScrolled = ref(false)
    const fileInput = ref(null)
    const canvasContainer = ref(null)
    let modelColor = ref('#42a5f5');
    let bgColor = ref('#f0f0f0')
    let isWireframe = ref(false)

    let scene, camera, renderer,controls, cube,model;

    let selectedFile = ref(null)
    let modelLoaded = ref(false)

    function handleScroll() {
        isScrolled.value = window.scrollY > 10;
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

    // 动画循环
    function animate() {
        requestAnimationFrame(animate)
        
        // cube.rotation.x += 0.01
        // cube.rotation.y += 0.01
        
        renderer.render(scene, camera)
    }
    
    function initMesh() {
        
    }

    // Center model in view
    function centerModel() {
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
                        color: modelColor,
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
                // Load STL data
                const loader = new OBJLoader();

                if(true)
                {
                    // Create material
                    const material = new THREE.MeshPhongMaterial({
                        color: modelColor,
                        wireframe: isWireframe,
                        side: THREE.DoubleSide
                    });
                    var decoder = new TextDecoder("utf-8");
                    console.log("input obj data=>",event.target.result);
                    model = loader.parse(decoder.decode(event.target.result));
                }
                else
                {
                    const object = await loader.loadAsync( './attmesh_0.obj' );
                    model = object;
                }

                scene.add(model);

                // Center the model
                //centerModel();
                
                modelLoaded.value = true;
                
            } catch (error) {
                console.error('Error loading OBJ file:', error);
                alert('Failed to load OBJ file. Please try another file.');
            }
        };
        
        reader.readAsArrayBuffer(file);
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