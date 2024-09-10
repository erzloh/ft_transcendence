import { navigateTo } from "../index.js";
import { BASE_URL } from "../index.js";

export async function profile() {
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
			const user = responseData.user;

			// Store the user id in the local storage
			localStorage.setItem('user_id', user.id);

			const usernameElem = document.getElementById('username-name');
			usernameElem.innerText = user.username;

			const emailElem = document.getElementById('username-email');
			emailElem.innerText = user.email;

			// Get the user's avatar
			const avatarElem = document.getElementById('avatar');
			const responseAvatar = await fetch(`${BASE_URL}/api/user_avatar`);

			if (responseAvatar.status !== 200) {
				avatarElem.src = 'static/assets/images/profile_pic_2.png';
			} else {
				const blob = await responseAvatar.blob();
				const url = URL.createObjectURL(blob);
				avatarElem.src = url;
			}

			// Show the profile page
			const profilePage = document.getElementById('profile-page');
			profilePage.style.display = 'flex';
		}
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