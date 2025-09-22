<template>
    <canvas id="c"></canvas>
</template>

<script setup>
    import * as THREE from 'three';
import { onMounted } from 'vue';

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

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	const material = new THREE.MeshBasicMaterial( { color: 0x44aa88 } ); // greenish blue

	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            console.log(`clientWidth=>${width},clientHeight=>${height}`);
            console.log(`canvas.width=>${canvas.width},canvas.height=>${canvas.height}`);
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

	function render( time ) {

		time *= 0.001; // convert time to seconds

        //避免立方体变形
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

		cube.rotation.x = time;
		cube.rotation.y = time;

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

onMounted(()=>{
    main();
})

</script>

<style scoped>
    * {
        margin: 0;
        height: 100%;
    }
    #c {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>