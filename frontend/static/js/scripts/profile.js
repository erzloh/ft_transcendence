import { navigateTo } from "../index.js";
import { BASE_URL } from "../index.js";

export async function profile() {
	console.log('hello from profile')
	async function renderLoggingInfo() {
		// Check if the user is logged in or not
		const response = await fetch(`${BASE_URL}/api/profile`);

		// If the user is not logged in, redirect to the login page
		if (response.status === 401 || response.status === 400) {
			navigateTo('/signin');
		}

		// If the user is logged in, show the profile page
		if (response.status === 200) {
			const responseData = await response.json();
			console.log(responseData);

			const user = responseData.user;

			const usernameElem = document.getElementById('username-name');
			usernameElem.innerText = user.username;

			const emailElem = document.getElementById('username-email');
			emailElem.innerText = user.email;

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
	logoutButton.addEventListener('click', async () => {
		const response = await fetch(`${BASE_URL}/api/logout`, {
			method: 'POST',
		});
		console.log(response);
		navigateTo('/profile');
	})

	await renderLoggingInfo();
}