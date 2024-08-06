import { setLanguage } from '../utils/languages.js';

// Function that will be called when the view is loaded
export function settings() {
	// Pretty background setting

	// Add event listener to the pretty background setting
	const prettyBgSetting = document.getElementById('pretty-bg-setting');
	prettyBgSetting.addEventListener('change', () => {
		localStorage.setItem('prettyBgSetting', prettyBgSetting.checked);
		document.querySelector('.gradients-container').style.display = prettyBgSetting.checked ? 'block' : 'none';
	});

	// Apply the pretty background setting from the local storage
	const prettyBgSettingValue = localStorage.getItem('prettyBgSetting');
	prettyBgSetting.checked = prettyBgSettingValue === 'true';
	document.querySelector('.gradients-container').style.display = prettyBgSettingValue === 'true' ? 'block' : 'none';

	// Change letter animation setting

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