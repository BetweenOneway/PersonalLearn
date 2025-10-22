<template>
    <div style="width: 100vw;height: 100vh;">
        <div style="width: 100vw;height: 100vh;" ref="threeeContainer"></div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, render } from 'vue'
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    
    const threeeContainer = ref(null)
    let scene, camera, renderer, controls,animationId

    // 动画循环
    function animate() {
        animationId = requestAnimationFrame(animate)
        // 更新控制器
        controls.update()
        // 渲染场景
        renderer.render(scene, camera)
    }

    function Init()
    {
        scene = new THREE.Scene();
        //scene.background = new THREE.Color(0xf8fafc);

        const {clientWidth,clientHeight} = threeeContainer.value;
        camera = new THREE.PerspectiveCamera(76,clientWidth/clientHeight,0.1,1000)
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({antialias:true})
        renderer.setSize(clientWidth,clientHeight)
        threeeContainer.value.appendChild(renderer.domElement)

        // 添加模型（立方体）
        const geometry = new THREE.BoxGeometry(2, 2, 2)
        const material = new THREE.MeshStandardMaterial({
            color: 0x3498db,
            roughness: 0.6,
            metalness: 0.4
        })
        let cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        // 添加辅助网格
        const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee)
        scene.add(gridHelper)
    
        // 添加光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 10, 7.5)
        scene.add(directionalLight)

        // 创建轨道控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        animate();
    }

    onMounted(()=>{
        Init();
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
    })
</script>