const prettyBgSetting = document.getElementById('pretty-bg-setting');
prettyBgSetting.addEventListener('change', () => {
	localStorage.setItem('prettyBgSetting', prettyBgSetting.checked);
	document.querySelector('.gradients-container').style.display = prettyBgSetting.checked ? 'block' : 'none';
});

const prettyBgSettingValue = localStorage.getItem('prettyBgSetting');
prettyBgSetting.checked = prettyBgSettingValue === 'true';
document.querySelector('.gradients-container').style.display = prettyBgSettingValue === 'true' ? 'block' : 'none';