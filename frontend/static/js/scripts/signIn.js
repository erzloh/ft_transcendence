import { navigateTo } from "../index.js";
import { updateTextForElem } from "../utils/languages.js";

export function signIn() {
	// Get the form elements from the HTML
	const usernameElem = document.getElementById("username");
	const passwordElem = document.getElementById("password");
	const usernameErrorElem = document.getElementById("username-error");
	const passwordErrorElem = document.getElementById("password-error");

	// Add event listeners for when the user leaves the input fields
	usernameElem.addEventListener("blur", validateUsername);
	passwordElem.addEventListener("blur", validatePassword);

	const signInButton = document.querySelector("#sign-in-button");

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

	function validatePassword() {
		const password = passwordElem.value;
		if (password === '') {
			updateTextForElem(passwordErrorElem, 'password-empty-error');
			return false;
		} else {
			passwordErrorElem.textContent = '\u00A0';
			return true;
		}
	}

	// Add event listener for the submit button
	signInButton.addEventListener("click", async (e) => {
		// test
		document.cookie = "session=123";
		navigateTo("/profile");
		return

		// Prevent the default behavior of the form
		e.preventDefault();

		// Validate the form
		const usernameValid = validateUsername();
		const passwordValid = validatePassword();

		// If the form is not valid, return
		if (!usernameValid || !passwordValid) {
			return;
		}

		const username = usernameElem.value;
		const password = passwordElem.value;

		// Send data to the server
		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password
			}),
		});

		// Get the response data into json
		const responseData = await response.json();

		// If there is an error
		if (responseData.status === "error") {
			// If the response status is an error, show the error message in the correct fields
			updateTextForElem(usernameErrorElem, responseData.message);
			updateTextForElem(passwordErrorElem, responseData.message);

		} else if (responseData.status === "success") {
			// If the response status is success, navigate to the profile page
			// simulate getting a cookie from the server
			document.cookie = "session=123";
			navigateTo("/profile");
		} else {
			// If the response status is unknown, show an error message
			const containerLogin = document.querySelector('.container-login');
			containerLogin.innerHTML = `
				<div class="error">
					<h5 id="failure-message" class="text-white">An error occured in the server</h5>
					<p class="text-white">${responseData.error}</p>
				</div>
			`;
			updateTextForElem(document.getElementById('failure-message'), 'sign-up-failure');
		}

	});
}