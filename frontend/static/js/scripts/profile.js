import { navigateTo } from "../index.js";
import { BASE_URL } from "../index.js";

export async function profile() {
	console.log('hello from profile')
	async function renderLoggingInfo() {
		// Check if the user is logged in or not
		const response = await fetch(`${BASE_URL}/api/test_token`);

		console.log(response);

		if (response.status === 401 || response.status === 400) {
			navigateTo('/signin');
		}

		if (response.status === 200) {
			const responseData = await response.json();
			console.log(responseData);
			const profilePage = document.getElementById('profile-page');
			profilePage.style.display = 'flex';
		}
		
		// if (response.ok) {
		// 	console.log('user is logged in');
		// 	const profilePage = document.getElementById('profile-page');
		// 	profilePage.style.display = 'flex';
		// } else {
		// 	console.log('user is not logged in');
		// 	const profilePage = document.getElementById('profile-page');
		// 	profilePage.style.display = 'none !important';
		// 	navigateTo('/signin');
		// }
	}

	// Log out button
	const logoutButton = document.querySelector('#logout-button');
	logoutButton.addEventListener('click', () => {
		document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		navigateTo('/profile');
	})

	await renderLoggingInfo();
}