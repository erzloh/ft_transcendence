import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { navigateTo } from '../index.js';

// Function that will be called when the view is loaded
export function signUp () {
    document.getElementById('username').addEventListener('blur', validateUsername);
	document.getElementById('email').addEventListener('blur', validateEmail);
	document.getElementById('password').addEventListener('blur', validatePassword);
	document.getElementById('sign-up-button').addEventListener('click', submitForm);

	function validateUsername() {
		const username = document.getElementById('username').value;
		const usernameError = document.getElementById('username-error');
		if (username === '') {
			updateTextForElem(usernameError, 'username-empty-error');
			return false;
		} else {
			usernameError.textContent = '\u00A0';
			return true;
		}
	}

	function validateEmail() {
		const email = document.getElementById('email').value;
		const emailError = document.getElementById('email-error');
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email === '') {
			updateTextForElem(emailError, 'e-mail-empty-error');
			return false;
		} else if (!emailPattern.test(email)) {
			updateTextForElem(emailError, 'e-mail-invalid-error');
			return false;
		} else {
			emailError.textContent = '\u00A0';
			return true;
		}
	}

	function validatePassword() {
		const password = document.getElementById('password').value;
		const passwordError = document.getElementById('password-error');
		if (password === '') {
			updateTextForElem(passwordError, 'password-empty-error');
			return false;
		} else if (password.length < 8) {
			updateTextForElem(passwordError, 'password-short-error');
			return false;
		} else {
			passwordError.textContent = '\u00A0';
			return true;
		}
	}

	async function submitForm(e) {
		console.log('submitForm');
		e.preventDefault();

		// Make sure that all the fields are valid
		const usernameValid = validateUsername();
		const emailValid = validateEmail();
		const passwordValid = validatePassword();

		// If all the fields are valid, send the data to the server
		if (usernameValid && emailValid && passwordValid) {
			const username = document.getElementById('username').value;
			const email = document.getElementById('email').value;
			const password = document.getElementById('password').value;
			const data = {
				username: username,
				email: email,
				password: password
			};
			const response = await fetch(`${BASE_URL}/api/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			const responseData = await response.json();
			
			// simulate response data
			// const responseData = {
			// 	status: 'success'
			// }

			// If the response status is an error, show error message in the correct fields
			if (responseData.status === 'error') {
				// Show error message on the correct field
				if (responseData.field === 'username') {
					updateTextForElem(document.getElementById('username-error'), responseData.message);
				} else if (responseData.field === 'email') {
					updateTextForElem(document.getElementById('email-error'), responseData.message);
				} else if (responseData.field === 'password') {
					updateTextForElem(document.getElementById('password-error'), responseData.message);
				}
			} else if (responseData.status === 'success') {
				// If the response status is success, show success message
				const containerLogin = document.querySelector('.container-login');
				containerLogin.innerHTML = `
					<div class="success">
						<h1 id="success-message" class="text-white">Sign up successful!</h1>
						<div class="d-flex align-items-center justify-content-center p-5">
							<svg class='loading-icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24" id="Timer-Zero--Streamline-Sharp">
								<desc>Timer Zero Streamline Icon: https://streamlinehq.com</desc>
								<g id="timer-zero--whole-midnight-hour-clock-time">
									<path id="Union" fill="#FFFFFF" fillRule="evenodd" d="M10.75 5V1h2.5v4h-2.5Zm-7.134 0.384 2.5 2.5 1.768 -1.768 -2.5 -2.5 -1.768 1.768Zm14.268 2.5 2.5 -2.5 -1.768 -1.768 -2.5 2.5 1.768 1.768Zm0 8.232 2.5 2.5 -1.768 1.768 -2.5 -2.5 1.768 -1.768Zm-11.768 0 -2.5 2.5 1.768 1.768 2.5 -2.5 -1.768 -1.768ZM10.75 19v4h2.5v-4h-2.5ZM5 13.25H1v-2.5h4v2.5Zm14 0h4v-2.5h-4v2.5Z" clipRule="evenodd" strokeWidth="1"></path>
								</g>
							</svg>
						</div>
					</div>
				`;
				updateTextForElem(document.getElementById('success-message'), 'sign-up-success');
				setTimeout(() => {
					navigateTo('/signin');
				}, 2000);
			} else {
				// If the response status is unknown, show an error message
				const containerLogin = document.querySelector('.container-login');
				containerLogin.innerHTML = `
					<div class="error">
						<h1 id="failure-message" class="text-white">An error occured in the server</h1>
						<p class="text-white">${responseData.error}</p>
					</div>
				`;
				updateTextForElem(document.getElementById('failure-message'), 'sign-up-failure');

			}
		}
	};
}
