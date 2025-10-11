<template>
    <div class="three-container" ref="container">
      <div class="info-panel">
        <p>操作说明:</p>
        <p>• 左键拖动: 旋转模型</p>
        <p>• 中键/滚轮: 缩放模型</p>
        <p>• 右键拖动: 平移模型</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as THREE from 'three'
  // 正确导入TrackballControls（Three.js 0.180.0版本）
  import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
  
  // 组件引用和变量
  const container = ref(null)
  let scene, camera, renderer, controls, cube, animationId
  
  // 初始化Three.js场景
  function initScene() {
    if (!container.value) return
  
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
  
    // 创建相机
    const { clientWidth, clientHeight } = container.value
    camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000)
    camera.position.z = 5
  
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(clientWidth, clientHeight)
    container.value.appendChild(renderer.domElement)
  
    // 添加模型（立方体）
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.6,
      metalness: 0.4
    })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
  
    // 添加辅助网格
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee)
    scene.add(gridHelper)
  
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)
  }
  
  // 初始化Trackball控制器
  function initControls() {
    if (!camera || !renderer) return
  
    // 初始化控制器
    controls = new TrackballControls(camera, renderer.domElement)
    
    // 配置控制器参数
    controls.rotateSpeed = 1.0    // 旋转速度
    controls.zoomSpeed = 1.2      // 缩放速度
    controls.panSpeed = 0.8       // 平移速度
    
    controls.noZoom = false       // 允许缩放
    controls.noPan = false        // 允许平移
    controls.noRotate = false     // 允许旋转
    
    controls.staticMoving = false // 禁用静态移动（启用惯性）
    controls.dynamicDampingFactor = 0.05 // 动态阻尼系数
    
    // 控制器状态变化时触发渲染
    controls.addEventListener('change', () => {
      renderer.render(scene, camera)
    })
  }
  
  // 动画循环
  function animate() {
    animationId = requestAnimationFrame(animate)
    // 更新控制器
    controls.update()
    // 渲染场景
    renderer.render(scene, camera)
  }
  
  // 窗口大小调整处理
  function handleResize() {
    if (!container.value || !camera || !renderer) return
  
    const { clientWidth, clientHeight } = container.value
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
    controls.handleResize() // 通知控制器窗口大小变化
  }
  
  // 组件挂载时初始化
  onMounted(() => {
    initScene()
    initControls()
    animate()
    window.addEventListener('resize', handleResize)
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
    window.removeEventListener('resize', handleResize)
  })
  </script>
  
  <style scoped>
  .three-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  .info-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    padding: 12px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    z-index: 100;
  }
  
  .info-panel p {
    margin: 4px 0;
  }
  </style>
  