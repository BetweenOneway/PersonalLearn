<template>
    <div ref="canvasContainer" class="canvas-container"></div>
  </template>
  
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'
    
    const canvasContainer = ref(null)
    let scene, camera, renderer, cube
  
    // 初始化场景
    function initScene() {
        // 1. 创建场景
        scene = new THREE.Scene()
        
        // 2. 创建相机（透视相机）
        initCamera();
    
        // 3. 创建渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        
        // 4. 挂载到DOM
        canvasContainer.value.appendChild(renderer.domElement)
    }

    function initCamera()
    {
        const fov = 75;
        const aspect = 2;  // 相机默认值
        const near = 0.1;
        const far = 5;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2
    }

    // 创建立方体
    function createCube() {
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const material = new THREE.MeshBasicMaterial(
            {
                color: 0x44aa88,
                wireframe: true 
            }
        );
        cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
    }
  
    // 动画循环
    function animate() {
        requestAnimationFrame(animate)
        
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        
        renderer.render(scene, camera)
    }
  
    onMounted(() => 
        {
            initScene()
            createCube()
            animate()
        }
    )
  
  // 组件卸载时清理资源
  onUnmounted(() => {
    if (renderer) {
      renderer.dispose()
      canvasContainer.value.removeChild(renderer.domElement)
    }
  })
</script>
  
<style scoped>
  .canvas-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    overflow: hidden;
  }
</style>