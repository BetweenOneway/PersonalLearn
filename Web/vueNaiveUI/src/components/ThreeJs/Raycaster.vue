<template>
    <div style="width: 100vw;height: 100vh;position:relative">
        <div style="width: 100vw;height: 100vh;" ref="threeeContainer"></div>
        <div class="absolute top-4 right-4 bg-gray-800/80 text-white px-4 py-2 rounded-md text-sm backdrop-blur-sm">
            <!--偏移控制-->
            <div>
                <h3 class="font-medium mb-2 text-sm">射线控制</h3>
                <div>
                    <button @click="RaycasterTest">测试射线求交</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    
    const threeeContainer = ref(null)
    let scene, camera,directionalLight, renderer, controls,animationId;
    let mesh1,mesh2,mesh3;
    let meshArray = [];

    // 窗口大小变化处理
    function onWindowResize() {
        if (!threeeContainer.value) return;

        const width = threeeContainer.value.clientWidth;
        const height = threeeContainer.value.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // 动画循环
    function animate() {
        animationId = requestAnimationFrame(animate)
        // 更新控制器
        controls.update()
        const vector = camera.position.clone();
        // 将相机位置赋值给光源
        directionalLight.position.set(vector.x, vector.y, vector.z);
        // 渲染场景
        renderer.render(scene, camera)
    }

    function Init()
    {
        meshArray = [];
        scene = new THREE.Scene();
        //scene.background = new THREE.Color(0xf8fafc);

        const {clientWidth,clientHeight} = threeeContainer.value;
        camera = new THREE.PerspectiveCamera(76,clientWidth/clientHeight,0.1,1000)
        camera.position.x = 100;
        camera.position.y = 100;
        camera.position.z = 100;

        renderer = new THREE.WebGLRenderer({antialias:true})
        renderer.setSize(clientWidth,clientHeight)
        threeeContainer.value.appendChild(renderer.domElement)

        // 添加模型（立方体）
        if(false)
        {
            const geometry = new THREE.BoxGeometry(2, 2, 2)
            const material = new THREE.MeshStandardMaterial({
                color: 0x3498db,
                roughness: 0.6,
                metalness: 0.4
            })
            let cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
        }
        else{
            const geometry = new THREE.SphereGeometry(25, 50, 50);

            //红
            const material1 = new THREE.MeshLambertMaterial({
                color: 0xff0000,
                side:THREE.DoubleSide, //重要，否则是单面的，射线求交会忽略从反面射入的点
            });
            mesh1 = new THREE.Mesh(geometry, material1);
            meshArray.push(mesh1);

            //绿
            const material2 = new THREE.MeshLambertMaterial({
                color: 0x00ff00,
                side:THREE.DoubleSide,//重要，否则是单面的，射线求交会忽略从反面射入的点
            });
            mesh2 = new THREE.Mesh(geometry, material2);
            mesh2.position.y = 100;
            meshArray.push(mesh2);

            //蓝
            const material3 = new THREE.MeshLambertMaterial({
                color: 0x0000ff,
                side:THREE.DoubleSide,//重要，否则是单面的，射线求交会忽略从反面射入的点
            });
            mesh3 = new THREE.Mesh(geometry, material3);
            mesh3.position.x = 75;
            meshArray.push(mesh3);

            const model = new THREE.Group();
            // 三个网格模型mesh1,mesh2,mesh3用于射线拾取测试
            model.add(mesh1, mesh2, mesh3);

            scene.add(model)
        }

        // 添加辅助网格
        const gridHelper = new THREE.GridHelper(200, 10, 0xcccccc, 0xeeeeee)
        scene.add(gridHelper)

        //
        const axesHelper = new THREE.AxesHelper(100);
        //scene.add(axesHelper);
    
        // 添加光源
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 10, 7.5)
        scene.add(directionalLight)

        // 创建轨道控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        animate();
    }

    function RaycasterTest()
    {
        const raycaster = new THREE.Raycaster();
        // 设置射线起点
        raycaster.ray.origin = new THREE.Vector3(0, 0, 0);
        // 设置射线方向射线方向沿着x轴
        raycaster.ray.direction = new THREE.Vector3(1, 0, 0);

        console.log('射线属性',raycaster.ray);

        // 射线发射拾取模型对象
        const intersects = raycaster.intersectObjects(meshArray);
        console.log("射线器返回的对象", intersects);
        for(let intersect of intersects)
        {
            console.log(`第${intersects.indexOf(intersect)}个交叉点`)
            console.log("交叉点坐标", intersect.point);
            console.log("交叉对象",intersect.object);
            console.log("射线原点和交叉点距离",intersect.distance);
        }

        let arrow = new THREE.ArrowHelper(
            raycaster.ray.direction,
            raycaster.ray.origin,
            200,
            0xffff00,
            0.5,
            0.3
        );
        console.log("arrow=>",arrow);
        scene.add(arrow);
    }

    function onCanvasClick(event) {
        let mouse = new THREE.Vector2();
        let raycaster = new THREE.Raycaster();

        // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
        const rect = threeeContainer.value.getBoundingClientRect();
        //clientX - rect.left：将浏览器坐标系的 clientX 转换为 canvas 内部的局部 X 坐标
        //除以 rect.width：将 X 坐标归一化到 [0, 1] 范围（0 对应左边缘，1 对应右边缘）。
        //乘以 2将 [0, 1] 映射到[0,2]
        //映射到 [-1, 1]（0→-1，1→1），符合 NDC 的 X 轴范围。
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        //负号是因为NDC坐标系的Y轴方向和HTML坐标系的Y轴方向是相反的
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);

        let arrow = new THREE.ArrowHelper(
            raycaster.ray.direction,
            raycaster.ray.origin,
            200,
            0xffff00,
            0.5,
            0.3
        );
        console.log("arrow=>",arrow);
        scene.add(arrow);

    }

    onMounted(()=>{
        Init();
        window.addEventListener('resize', onWindowResize);
        // 射线交互事件
        window.addEventListener('click', onCanvasClick);
    })

    // 组件卸载时清理
    onUnmounted(() => {
        // 清除动画循环
        if (animationId) {
            cancelAnimationFrame(animationId)
        }
        
        // 释放控制器资源
        if (controls) {
            controls.dispose()
        }
        
        // 释放渲染器资源
        if (renderer) {
            renderer.dispose()
        }
        
        // 移除事件监听
        window.removeEventListener('resize', onWindowResize);
        // 移除射线交互事件
        window.removeEventListener('click', onCanvasClick);
    })
</script>