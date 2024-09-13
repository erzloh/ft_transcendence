import * as THREE from 'three';

export function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    // spotLight.position.set(0, 5, 10);
    // scene.add(pointLight);
	

	const light1 = new THREE.SpotLight( 0xffffff, 150, 0, 1.75, 0.5 );
	light1.castShadow = true; // default false
	light1.position.set(15, 20, 0);
	scene.add( light1 );
	const light2 = new THREE.SpotLight( 0xffffff, 150, 0, 1.5, 0.5 );
	light2.castShadow = true; // default false
	light2.position.set(-15, 20, 0);
	scene.add( light2 );

	// const helper = new THREE.DirectionalLightHelper( pointLight, 5 );
	// scene.add( helper );
	// const sphereSize = 1;
	// const pointLightHelper1 = new THREE.SpotLightHelper( light1, sphereSize );
	// const pointLightHelper2 = new THREE.SpotLightHelper( light2, sphereSize );
	// scene.add( pointLightHelper1, pointLightHelper2 );
}