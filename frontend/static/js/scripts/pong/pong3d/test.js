import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


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

    // Load the GLTF model
    const loader = new GLTFLoader();

	loader.load('/static/assets/pong/scene.gltf', function (gltf) {
		scene.add(gltf.scene);
	
		ball = gltf.scene.getObjectByName('Ball');
		paddleLeft = gltf.scene.getObjectByName('PaddleLeft');
		paddleRight = gltf.scene.getObjectByName('PaddleRight');
		
		// Find the plane in the scene by its name (assuming it's named "Plane")
		const plane = gltf.scene.getObjectByName('Plane');
		
		if (plane) {
			// Set the plane material to be transparent
			plane.material.transparent = true;
			plane.material.opacity = 0.1; // Adjust this value to control transparency (0.0 - fully transparent, 1.0 - fully opaque)
			plane.material.depthWrite = false; // Optional: prevents depth issues with other transparent objects
		}
	}, undefined, function (error) {
		console.error('Error loading GLTF:', error);
	});

	/*const helper1 = new THREE.BoxHelper(paddleLeft, 0xff0000);
	const helper2 = new THREE.BoxHelper(paddleRight, 0x00ff00);
	const helper3 = new THREE.BoxHelper(ball, 0x0000ff);
	scene.add(helper1, helper2, helper3);
	*/

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
		const zBound = 8.5 - 2.5;
		paddleLeft.position.z = Math.max(-zBound, Math.min(zBound, paddleLeft.position.z)); 
		paddleRight.position.z = Math.max(-zBound, Math.min(zBound, paddleRight.position.z));
	}

	let originalSpeed = new THREE.Vector3(0.15, 0, 0.15);
	let ballSpeed = originalSpeed.clone();

	function moveBall() {
		ball.position.x += ballSpeed.x;
		ball.position.z += ballSpeed.z;

		// Ball collision with top and bottom walls (walls are at z = ±8.3229)
		if (ball.position.z >= 8.35 || ball.position.z <= -8.35) {
			ballSpeed.z = -ballSpeed.z;  // Reverse Z direction
		}

		// Ball collision with paddles
		if (collisionDetect(paddleLeft, ball) || collisionDetect(paddleRight, ball)) {
			ballSpeed.x = -ballSpeed.x;  // Reverse X direction
			increaseBallSpeed();
		}

		// Ball out of bounds (scoring)
		if (ball.position.x > 17 || ball.position.x < -17) {  // X limits based on paddle positions
			resetBall();
		}
	}

	function increaseBallSpeed() {
		const speedMultiplier = 1.05;  // Increase speed by 5% with each paddle hit
		ballSpeed.multiplyScalar(speedMultiplier);
	}

	function resetBall() {
		ball.position.set(0, 0, 0);  // Reset ball position on XZ plane
		ballSpeed.copy(originalSpeed);  // Reset speed and direction to the original speed
	}

	function collisionDetect(paddle, ball) {
		const paddleBox = new THREE.Box3().setFromObject(paddle);
		const ballBox = new THREE.Box3().setFromObject(ball);
		return paddleBox.intersectsBox(ballBox);
	}

	const fontLoader = new FontLoader();
    fontLoader.load('/static/assets/pong/Orbitron_Regular.json', function (font) {
        const textGeometry = new TextGeometry('0', {
            font: font,
            size: 2,  // Size of the text
            height: 0.5,  // Thickness of the text
            curveSegments: 12,  // Number of segments for text curves
            bevelEnabled: true,  // Enables bevel
            bevelThickness: 0.1,  // Thickness of the bevel
            bevelSize: 0.1,  // Distance from the text outline to bevel start
            bevelOffset: 0,
            bevelSegments: 5  // Number of bevel segments
        });

		const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,  // Emissive color (glow)
            emissiveIntensity: 1.0 // Increase the intensity for more glow
        });

        const scoreLeft = new THREE.Mesh(textGeometry, textMaterial);
        const scoreRight = new THREE.Mesh(textGeometry, textMaterial);

        // Position the score above the paddles
        scoreLeft.position.set(-9.5, 2, -12.5);  // Adjust position as needed
        scoreRight.position.set(7.5, 2, -12.5);

		scoreLeft.rotation.x = Math.PI / 1.5;
		scoreRight.rotation.x = Math.PI / 1.5;

        scene.add(scoreLeft);
        scene.add(scoreRight);
    });

	const ambientLight = new THREE.AmbientLight(0x404040, 2);  // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);



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