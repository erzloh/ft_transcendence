import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { navigateTo } from '../index.js';

// Function that will be called when the view is loaded
export function signUp () {
	// Get the elements from the HTML
	const usernameElem = document.getElementById('username');
	const emailElem = document.getElementById('email');
	const passwordElem = document.getElementById('password');
	
	const usernameErrorElem = document.getElementById('username-error');
	const emailErrorElem = document.getElementById('email-error');
	const passwordErrorElem = document.getElementById('password-error');
	
	// Add event listeners for when the user leaves the input fields
	usernameElem.addEventListener('blur', validateUsername);
	emailElem.addEventListener('blur', validateEmail);
	passwordElem.addEventListener('blur', validatePassword);
	
	// Add event listener for the submit button
	const signUpButtonElem = document.getElementById('sign-up-button');
	signUpButtonElem.addEventListener('click', submitForm);

	// Validates the username, returns true if it is valid
	function validateUsername() {
		const username = usernameElem.value;
		if (username === '') {
			updateTextForElem(usernameErrorElem, 'username-empty-error');
			return false;
		} else {
			usernameErrorElem.textContent = '\u00A0';
			return true;
		}
	}

	function validateEmail() {
		const email = emailElem.value;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email === '') {
			updateTextForElem(emailErrorElem, 'e-mail-empty-error');
			return false;
		} else if (!emailPattern.test(email)) {
			updateTextForElem(emailErrorElem, 'e-mail-invalid-error');
			return false;
		} else {
			emailErrorElem.textContent = '\u00A0';
			return true;
		}
	}

	function validatePassword() {
		const password = passwordElem.value;
		if (password === '') {
			updateTextForElem(passwordErrorElem, 'password-empty-error');
			return false;
		} else if (password.length < 8) {
			updateTextForElem(passwordErrorElem, 'password-short-error');
			return false;
		} else if (password.length > 64) {
			updateTextForElem(passwordErrorElem, 'password-long-error');
			return false;
		} else if (!/[A-Z]/.test(password)) {
			updateTextForElem(passwordErrorElem, 'password-uppercase-error');
			return false;
		} else if (!/[a-z]/.test(password)) {
			updateTextForElem(passwordErrorElem, 'password-lowercase-error');
			return false;
		} else if (!/\d/.test(password)) {
			updateTextForElem(passwordErrorElem, 'password-number-error');
			return false;
		} else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
			updateTextForElem(passwordErrorElem, 'password-special-error');
			return false;
		} else {
			passwordErrorElem.textContent = '\u00A0';
			return true;
		}
	}

	async function submitForm(e) {
		console.log('submitForm');
		e.preventDefault();

		// Make sure that all the fields are valid (at least front-end-wise)
		const usernameValid = validateUsername();
		const emailValid = validateEmail();
		const passwordValid = validatePassword();

		// If all the fields are valid, send the data to the server
		if (usernameValid && emailValid && passwordValid) {
			// Prepare the data to be sent
			const username = usernameElem.value;
			const email = emailElem.value;
			const password = passwordElem.value;

			const data = {
				username: username,
				email: email,
				password: password
			};

			// Send the data to the server
			const response = await fetch(`${BASE_URL}/api/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			// Get the response data into json
			const responseData = await response.json();
			
			// simulate response data
			// const responseData = {
			// 	status: 'success'
			// }

			// If the response status is an error, show the error message in the correct fields
			if (responseData.status === 'error') {
				if (responseData.field === 'username') {
					updateTextForElem(document.getElementById('username-error'), responseData.message);
				} else if (responseData.field === 'email') {
					updateTextForElem(document.getElementById('email-error'), responseData.message);
				} else if (responseData.field === 'password') {
					updateTextForElem(document.getElementById('password-error'), responseData.message);
				}
			} else if (responseData.status === 'success') {
				// If the response status is success, show success message and navigate to the login page
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
