<template>
    <!-- <div ref="canvasContainer" class="canvas-container"></div> -->
    <canvas id="c"></canvas>
  </template>
  
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'
    
    function main() {

        const canvas = document.querySelector( '#c' );
        const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

        const fov = 75;
        const aspect = 2; // the canvas default
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
        camera.position.z = 2;

        const scene = new THREE.Scene();

        {

            const color = 0xFFFFFF;
            const intensity = 3;
            const light = new THREE.DirectionalLight( color, intensity );
            light.position.set( - 1, 2, 4 );
            scene.add( light );
        }

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

        const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } ); // greenish blue

        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );      

        function render( time ) {

            time *= 0.001; // convert time to seconds

            cube.rotation.x = time;
            cube.rotation.y = time;

            renderer.render( scene, camera );

            requestAnimationFrame( render );

        }

        requestAnimationFrame( render );

    }



//     const canvasContainer = ref(null)
//     let scene, camera, renderer, cube
  
//     // 初始化场景
//     function initScene() {
//         // 1. 创建场景
//         scene = new THREE.Scene()
        
//         // 2. 创建相机（透视相机）
//         initCamera();
    
//         // 3. 创建渲染器
//         renderer = new THREE.WebGLRenderer({ antialias: true })
//         renderer.setSize(window.innerWidth, window.innerHeight)
        
//         // 4. 挂载到DOM
//         canvasContainer.value.appendChild(renderer.domElement)
//     }

//     function initCamera()
//     {
//         const fov = 75;
//         const aspect = 2;  // 相机默认值
//         const near = 0.1;
//         const far = 5;
//         camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//         camera.position.z = 2
//     }

//     // 创建立方体
//     function createCube() {
//         const boxWidth = 1;
//         const boxHeight = 1;
//         const boxDepth = 1;
//         const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
//         const material = new THREE.MeshBasicMaterial(
//             {
//                 color: 0x44aa88,
//                 wireframe: true 
//             }
//         );
//         cube = new THREE.Mesh(geometry, material)
//         scene.add(cube)
//     }
  
//     // 动画循环
//     function animate() {
//         requestAnimationFrame(animate)
        
//         cube.rotation.x += 0.01
//         cube.rotation.y += 0.01
        
//         renderer.render(scene, camera)
//     }
  
    onMounted(() => 
        {
            main();
            // initScene()
            // createCube()
            // animate()
        }
    )
</script>
  
<style scoped>
  .canvas-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    overflow: hidden;
  }
</style>