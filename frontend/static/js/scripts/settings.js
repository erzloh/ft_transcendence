import { setLanguage } from '../utils/languages.js';
import { BASE_URL } from '../index.js';

// Function that will be called when the view is loaded
export function settings() {
	// Graphics settings
	const ultraRadio = document.getElementById("graphics-ultra-radio");
	const mediumRadio = document.getElementById("graphics-medium-radio");
	const noneRadio = document.getElementById("graphics-none-radio");
	
	const gradientsContainer = document.querySelector('.gradients-container');
	const videoBackground = document.querySelector('#video-background');

	ultraRadio.addEventListener("change", () => {
		if (ultraRadio.checked) {
			localStorage.setItem('graphics', 'ultra');
			gradientsContainer.style.display = 'block';
			videoBackground.style.display = 'none';
		}
	});

	mediumRadio.addEventListener("change", function() {
		if (mediumRadio.checked) {
			localStorage.setItem('graphics', 'medium');
			gradientsContainer.style.display = 'none';
			videoBackground.style.display = 'block';
		}
	});

	noneRadio.addEventListener("change", function() {
		if (noneRadio.checked) {
			localStorage.setItem('graphics', 'none');
			gradientsContainer.style.display = 'none';
			videoBackground.style.display = 'none';
		}
	});

	// Apply the graphics setting from the local storage
	let graphicsSetting = localStorage.getItem('graphics');
	if (!graphicsSetting) {
		localStorage.setItem('graphics', 'medium');
		graphicsSetting = 'medium';
	}

	if (graphicsSetting === 'ultra') {
		ultraRadio.checked = true;
		gradientsContainer.style.display = 'block';
		videoBackground.style.display = 'none';
	} else if (graphicsSetting === 'medium') {
		mediumRadio.checked = true;
		gradientsContainer.style.display = 'none';
		videoBackground.style.display = 'block';
	} else {
		noneRadio.checked = true;
		gradientsContainer.style.display = 'none';
		videoBackground.style.display = 'none';
	}
	
	// Switch language setting
	document.getElementById('languageSwitcher').addEventListener('change', (event) => {
		setLanguage(event.target.value);
		// Save the language setting in the local storage
		localStorage.setItem('language', event.target.value);
	});

	// Apply the language setting from the local storage
	const languageSetting = localStorage.getItem('language');
	document.getElementById('languageSwitcher').value = languageSetting ? languageSetting : 'en';
}