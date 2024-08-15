import * as THREE from 'three';

export function pongThree() {


	const canvasRef = document.getElementById('canvas');
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 75, canvasRef.width / canvasRef.height, 0.1, 1000 );

	const renderer = new THREE.WebGLRenderer({
		antialas:true,
		canvas:canvasRef

	});
	renderer.setSize( canvasRef.width, canvas.height);
	document.body.appendChild( renderer.domElement );

	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;

	function animate() {
		renderer.render( scene, camera );
	}
	renderer.setAnimationLoop( animate );
}