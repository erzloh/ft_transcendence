// ------------------------------- IMPORT THE VIEWS -------------------------------
// A view is a class containing the HTML and JS of a page
import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import Settings from "./views/Settings.js";
import NotFound from "./views/NotFound.js";

// ------------------------------- ROUTING -------------------------------
// Array that contains all routes where each route has a path and a view
const routes = [
	{ path: "/", view: Home },
	{ path: "/pong", view: Pong },
	{ path: "/settings", view: Settings },
];

// Loads the view (HTML and JS) in the div with id "app" according to the current path
const router = async () => {
	// Test if the current path is in the routes array
	let match = routes.find(route => route.path === location.pathname);

	// If the current path is not in the routes array, set the match to the NotFound view
    if (!match) {
		match = { path: "", view: NotFound };
    }

	// Create a new instance of the view
    const view = new match.view();

	// Load the HTML of the view in the app div
    document.querySelector("#app").innerHTML = await view.getHtml();

	// Load the JS of the view
	await loadScript(view);

	// Overwrite the default behavior of the links to not reload the page
	attachEventListenersToLinks();

	// Animate letters
	animateLetters();
};

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
};

// Load script
const loadScript = async (view) => {
	// Get the dynamic script element
	const dynamicScript = document.getElementById('dynamic-script');

	// Create a new script element
	const newScript = document.createElement('script');
	newScript.textContent = await view.getJS();
	newScript.id = 'dynamic-script';

	// Replace the dynamic script element with the new script element
	// This is needed to load the new JS content
	dynamicScript.parentNode.replaceChild(newScript, dynamicScript);
}

// ------------------------------- THE APP STARTS HERE -------------------------------
// When the DOM is loaded, call the router function
document.addEventListener("DOMContentLoaded", () => {
	router();
});

// ------------------------------- NAVIGATION -------------------------------
// Navigate to a new view
const navigateTo = url => {
	// Change the URL to the new URL and add a state to the history stack
    history.pushState(null, null, url);

	// Update the view
    router();
};

// Listen for the popstate event (back and forward buttons) and call the router function
window.addEventListener("popstate", router);

// ------------------------------- FRONTEND EYE CANDIES -------------------------------
// Changing letter animation
const animateLetters = () => {
	const letters = "abcdefghijklmnopqrstuvwxyz";

    let interval = null;

    const text = document.querySelector("[animated-letters]");
    if (!text) return;

    let iteration = 0;

    const startAnimation = () => {
        clearInterval(interval);

        interval = setInterval(() => {
            text.innerText = text.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return text.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= text.dataset.value.length) { 
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    };

    // Start the animation immediately
    startAnimation();
};

// Interactive bubble
document.addEventListener('DOMContentLoaded', () => {
	const interBubble = document.querySelector('.interactive');
	if (!interBubble) return;

    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});