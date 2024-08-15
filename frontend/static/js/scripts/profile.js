import { navigateTo } from "../index.js";

export async function profile() {
	console.log('hello from profile')
	async function renderLoggingInfo() {
		// Check if the user is logged in or not
		// const response = await fetch('https://jsonplaceholder.typicode.com/users/1', {
		// fetch an error page to test the else condition
		// const response = await fetch('https://localhost/static/sadjlaksjdl', {
		// 	credentials: 'include'
		// });
		// check if the cookie session=123 is set
		let response = {};
		if (document.cookie.includes('session=123')) {
			response = {
				ok: true,
				json: async () => {
					return { username: 'John Doe' };
				}
			};
		} else {
			response = {
				ok: false
			};
		}
		
		// const loggingInfo = document.querySelector('#logging-info');
		if (response.ok) {
			console.log('user is logged in');
			const profilePage = document.getElementById('profile-page');
			profilePage.style.display = 'flex';
			
			// const user = await response.json();
			// loggingInfo.innerHTML = `<div class="col-12 text-center">
			// 	<p class="text-light">Welcome, ${user.username}!</p>
			// 	<button class="btn text-light" id="log-out-button" data-translate="logout">logout</button>
			// </div>`;
			// const logOutButton = document.querySelector('#log-out-button');
			// logOutButton.addEventListener('click', () => {
			// 	document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			// 	navigateTo('/profile');
			// });
		} else {
			console.log('user is not logged in');
			const profilePage = document.getElementById('profile-page');
			profilePage.style.display = 'none !important';
			navigateTo('/signin');
			// loggingInfo.innerHTML = `<div class="col-12 text-center">
			// 	<a role="button" class="btn text-light" href="/signup" data-link data-translate="sign up">sign up</a>
			// 	<a role="button" class="btn text-light" href="/signin" data-link data-translate="login">login</a>
			// </div>`;
		}
		console.log('finished rendering logging info');
	}

	// Log out button
	const logoutButton = document.querySelector('#logout-button');
	logoutButton.addEventListener('click', () => {
		document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		navigateTo('/profile');
	})

	await renderLoggingInfo();
}