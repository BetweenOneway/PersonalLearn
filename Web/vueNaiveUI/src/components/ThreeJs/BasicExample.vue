<template>
    <canvas id="c"></canvas>
</template>
  
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'

    function main() {

        //renderer
        const canvas = document.querySelector( '#c' );
        const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

        //camera
        const fov = 75;
        const aspect = 2; // the canvas default
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
        camera.position.z = 2;

        //场景
        const scene = new THREE.Scene();

        //灯光
        {
            const color = 0xFFFFFF;
            const intensity = 3;
            const light = new THREE.DirectionalLight( color, intensity );
            light.position.set( - 1, 2, 4 );
            scene.add( light );
        }

        //网格
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

        function makeInstance( geometry, color, x ) {

            const material = new THREE.MeshPhongMaterial( { color } );

            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );

            cube.position.x = x;

            return cube;

        }

        const cubes = [
            makeInstance( geometry, 0x44aa88, 0 ),//绿蓝色
            makeInstance( geometry, 0x8844aa, - 2 ),//紫色
            makeInstance( geometry, 0xaa8844, 2 ),//卢克索金色 泥土黄
        ];

        //动画
        function render( time ) {
            time *= 0.001; // convert time to seconds

            cubes.forEach( ( cube, ndx ) => {

                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;

            } );

            renderer.render( scene, camera );

            requestAnimationFrame( render );
        }

        requestAnimationFrame( render );
    }
  
    onMounted(() => 
        {
            main();
        }
    )
</script>
  
<style scoped>
  #c {
        width: 100%;
        height: 100%;
    }
</style>