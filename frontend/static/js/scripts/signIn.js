import { navigateTo } from "../index.js";

export function signIn() {
	console.log("Hello from signIn.js");
	const signInButton = document.querySelector("#sign-in-button");
	signInButton.addEventListener("click", async () => {
		// simulate getting a cookie from the server
		document.cookie = "session=123";
		navigateTo("/profile");
	});
}