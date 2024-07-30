// select the pretty-bg-setting checkbox id
// add event listener on checked 
// store value in the local storage
// select the gradient-container class
// set style display to none

const prettyBgSetting = document.getElementById('pretty-bg-setting');
prettyBgSetting.addEventListener('change', () => {
	localStorage.setItem('prettyBgSetting', prettyBgSetting.checked);
	document.querySelector('.gradients-container').style.display = prettyBgSetting.checked ? 'block' : 'none';
});