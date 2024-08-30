// ------------------------------- IMPORT VIEWS -------------------------------
// A view is a class containing the HTML and JS of a page
import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import PongMenu from "./views/PongMenu.js";
import Settings from "./views/Settings.js";
import Pacman from "./views/Pacman.js";
import PacmanMenu from "./views/PacmanMenu.js";
import NotFound from "./views/NotFound.js";
import Games from "./views/Games.js";
import Profile from "./views/Profile.js";
import SignIn from "./views/SignIn.js";
import SignUp from "./views/SignUp.js";
import EditProfile from "./views/EditProfile.js";
import Friends from "./views/Friends.js";

// ------------------------------- IMPORT VISUALS -------------------------------
import './visual/interactiveBg.js'
import { animateLetters, moveNoise } from './visual/effects.js'

// ------------------------------- IMPORT UTILS ---------------------------------
import { setLanguage, updateTexts } from "./utils/languages.js";

// ------------------------------- CONFIGURE GLOBAL VARIABLES -------------------------------
// Set the base URL of the website
export const BASE_URL = "https://localhost";
// Store interval IDs (to be able to clear them later)
export const ids = {};

// ------------------------------- THE APP STARTS HERE -------------------------------
// When the DOM is loaded, call the router function
document.addEventListener("DOMContentLoaded", async () => {
	await router();
});

// ------------------------------- ROUTING -------------------------------
// Array that contains all routes where each route has a path and a view
const routes = [
	{ path: "/", view: Home },
	{ path: "/pong", view: Pong },
	{ path: "/pongMenu", view: PongMenu },
	{ path: "/pacman", view: Pacman },
	{ path: "/pacmanMenu", view: PacmanMenu },
	{ path: "/settings", view: Settings },
	{ path: "/games", view: Games },
	{ path: "/profile", view: Profile },
	{ path: "/signin", view: SignIn },
	{ path: "/signup", view: SignUp },
	{ path: "/edit-profile", view: EditProfile },
	{ path: "/friends", view: Friends }
];

// Store the current view
let view = null;

// Loads the view (HTML and JS) in the div with id "app" according to the current path
const router = async () => {
	// Test if the current path is in the routes array
	let match = routes.find(route => route.path === location.pathname);
	
	// If the current path is not in the routes array, set the match to the NotFound view
    if (!match) {
		match = { path: "", view: NotFound };
    }

	// If there's an old view, clean it up
    if (view) {
        view.cleanUpEventListeners();
        view.stopJS();
    }
	
	// Create a new instance of the view
    view = new match.view();
	
	// Load the HTML of the view in the app div
	const appDiv = document.querySelector("#app");
    appDiv.innerHTML = await view.getHtml();

	// Load the JS of the view
	await view.loadJS();

	// Focus on the main element
	appDiv.focus();

	// Overwrite the default behavior of the links to not reload the page
	attachEventListenersToLinks();

	// Initialize with default language
	updateTexts();

	// Animate letters
	animateLetters();
};

// Load script
const loadScript = async (view) => {
	// Get the dynamic script element
	const dynamicScript = document.getElementById('dynamic-script');

	// Create a new script element
	const newScript = document.createElement('script');
    //newScript.type = 'module'; // Ensure the script is treated as an ES module
	newScript.textContent = await view.getJS();
	newScript.id = 'dynamic-script';

	// Replace the dynamic script element with the new script element
	// This is needed to load the new JS content
	dynamicScript.parentNode.replaceChild(newScript, dynamicScript);
}

// Function to attach event listeners to the links
// Overwrite the default behavior of the links (<a> tags)
// When a link is clicked, the navigateTo function is called
// The navigateTo function changes the URL and calls the router function 
// to load the new view without reloading the page.
const attachEventListenersToLinks = () => {
	// Select all links with the attribute data-link
	const links = document.querySelectorAll('[data-link]');

	// Attach event listener to each link
	links.forEach(link => {
		link.addEventListener("click", e => {
			e.preventDefault();
			navigateTo(link.href);
		});
	});
}

// ------------------------------- NAVIGATION -------------------------------
// Navigate to a new view
export const navigateTo = url => {
	// Change the URL to the new URL and add a state to the history stack
    history.pushState(null, null, url);

	// Update the view
    router();
};

// Listen for the popstate event (back and forward buttons) and call the router function
window.addEventListener("popstate", router);

// ------------------------------- APPLY SETTINGS -------------------------------
// Apply the settings from the local storage

// Background gradients
let graphicsSetting = localStorage.getItem('graphics');
// If the graphics setting is not set, set it to "medium" by default
if (!graphicsSetting) {
	localStorage.setItem('graphics', 'medium');
	graphicsSetting = 'medium';
}

if (graphicsSetting === 'ultra') {
	document.querySelector('.gradients-container').style.display = 'block';
	document.querySelector('#video-background').style.display = 'none';
} else if (graphicsSetting === 'medium') {
	document.querySelector('.gradients-container').style.display = 'none';
	document.querySelector('#video-background').style.display = 'block';
} else {
	document.querySelector('.gradients-container').style.display = 'none';
	document.querySelector('#video-background').style.display = 'none';
}

// Background noise
let noiseSetting = localStorage.getItem('noise');
// If the noise setting is not set, set it to "on" by default
if (!noiseSetting) {
	localStorage.setItem('noise', 'on');
	noiseSetting = 'on';
}

if (noiseSetting === 'on') {
	document.querySelector('.background-noise').style.display = 'block';
	ids.moveNoiseInterval = setInterval(moveNoise, 100);
} else {
	document.querySelector('.background-noise').style.display = 'none';
}

// Set Language
setLanguage(localStorage.getItem('language') ? localStorage.getItem('language') : 'en');
