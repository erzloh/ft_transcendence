import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/*export function pongThree() {


	const canvasRef = document.getElementById('canvas');
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 75, canvasRef.width / canvasRef.height, 0.1, 1000 );

	const renderer = new THREE.WebGLRenderer({
		antialias:true,
		canvas:canvasRef

	});
	renderer.setSize( canvasRef.width, canvas.height);
	document.body.appendChild( renderer.domElement );

	const loader = new GLTFLoader();
	loader.load( './static/assets/pong/lastetest.gltf', function ( gltf ) {

	scene.add( gltf.scene );
	}

	, undefined, function ( error ) {

	console.error( error );
	}

 );
 */

 /* coordonnée plus ou moins au centre :


 */


export function pongThree() {
    // Set up the scene, camera, and renderer
    const canvasRef = document.getElementById('canvas');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(90, canvasRef.width / canvasRef.height, 0.1, 10000);
    camera.position.z = 15;
	camera.position.x = 0;
	camera.position.y = 20;

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasRef
    });
    renderer.setSize(canvasRef.width, canvasRef.height);
    //document.body.appendChild(renderer.domElement);


	const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Optional: smooth camera motion
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

	let ball, paddleLeft, paddleRight;


    // Add lighting
   /* const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
    scene.add(ambientLight);
	*/

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load('/static/assets/pong/lastetest.gltf', function (gltf) {
        scene.add(gltf.scene);

		ball = gltf.scene.getObjectByName('Ball');
    	paddleLeft = gltf.scene.getObjectByName('PaddleLeft');
    	paddleRight = gltf.scene.getObjectByName('PaddleRight');

    }, undefined, function (error) {
        console.error('giga merde le gltf il est ou', error);
    });

	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		KeyW: false,
		KeyS: false,
		Space: false
	};
	
	document.addEventListener('keydown', (event) => {
		keys[event.code] = true;
	});
	
	document.addEventListener('keyup', (event) => {
		keys[event.code] = false;
	});


	const paddleSpeed = 0.2

	function movePaddles() {
		if (keys.ArrowUp) 
			paddleRight.position.z -= paddleSpeed;
		if (keys.ArrowDown)
			paddleRight.position.z += paddleSpeed;
		if (keys.KeyW)
			paddleLeft.position.z -= paddleSpeed;
		if (keys.KeyS)
			paddleLeft.position.z += paddleSpeed;
		
		// Prevent paddles from moving out of bounds (assuming -8.3 to 8.3 based on the walls)
		const zBound = 8.3 - 2.5;
		paddleLeft.position.z = Math.max(-zBound, Math.min(zBound, paddleLeft.position.z)); 
		paddleRight.position.z = Math.max(-zBound, Math.min(zBound, paddleRight.position.z));
	}

	let ballSpeed = new THREE.Vector3(0.15, 0, 0.15);  // Adjust speed

	function moveBall() {
		ball.position.x += ballSpeed.x;
		ball.position.z += ballSpeed.z;

		// Ball collision with top and bottom walls (walls are at z = ±8.3229)
		if (ball.position.z >= 8.3 || ball.position.z <= -8.3) {
			ballSpeed.z = -ballSpeed.z;  // Reverse Z direction
		}

		// Ball collision with paddles
		if (collisionDetect(paddleLeft, ball) || collisionDetect(paddleRight, ball)) {
			ballSpeed.x = -ballSpeed.x;  // Reverse X direction
		}

		// Ball out of bounds (scoring)
		if (ball.position.x > 17 || ball.position.x < -17) {  // X limits based on paddle positions
			resetBall();
		}
	}

	function resetBall() {
		ball.position.set(0, 0, 0);  // Reset ball position on XZ plane
		ballSpeed.set(0.15, 0, 0.15);  // Reset speed and direction
	}

	function collisionDetect(paddle, ball) {
		// Define paddle boundaries
		const paddleTop = paddle.position.z + 1.25;  // Half of scale.z for paddle
		const paddleBottom = paddle.position.z - 1.25;
		const paddleLeft = paddle.position.x - 0.1;
		const paddleRight = paddle.position.x + 0.1;
	
		// Define ball boundaries
		const ballTop = ball.position.z + 0.15;  // Half of scale.z for ball
		const ballBottom = ball.position.z - 0.15;
		const ballLeft = ball.position.x - 0.15;
		const ballRight = ball.position.x + 0.15;
	
		return paddleLeft < ballRight &&
			   paddleRight > ballLeft &&
			   paddleTop > ballBottom &&
			   paddleBottom < ballTop;
	}

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
		movePaddles();
		moveBall();
		controls.update();
	    renderer.render(scene, camera);

		//console.log("z: ", camera.position.z);
		//console.log("x : ", camera.position.x);
		//console.log("y: ", camera.position.y);
    }

    animate(); // Start the animation loop
}


	/*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;

	function animate() {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render( scene, camera );
	}
	renderer.setAnimationLoop( animate );
	*/