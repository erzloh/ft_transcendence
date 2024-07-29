// Import the views
// A view is a class containing the HTML of a page
import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import Settings from "./views/Settings.js";
import Pacman from "./views/Pacman.js";
import NotFound from "./views/NotFound.js";

// Array that contains all routes where each route has a path and a view
const routes = [
	{ path: "/", view: Home },
	{ path: "/pong", view: Pong },
	{ path: "/pacman", view: Pacman },
	{ path: "/settings", view: Settings },
];

// When the DOM is loaded, call the router function
document.addEventListener("DOMContentLoaded", () => {
	router();
});

// Navigate to a new view
const navigateTo = url => {
	// Change the URL to the new URL and add a state to the history stack
    history.pushState(null, null, url);

	// Update the view
    router();
};


// Load the HTML of the view in the app div
const router = async () => {

	// Test if the current path is in the routes array
	let match = routes.find(route => route.path === location.pathname);

	// If the current path is not in the routes array, set the match to the first route
    if (!match) {
		match = { path: "", view: NotFound };
    }

	// Create a new instance of the view
    const view = new match.view();

	// Load the HTML of the view in the app div
    document.querySelector("#app").innerHTML = await view.getHtml();

	// Attach event listeners to the links.
	// Overwrite the default behavior of the links (<a> tags)
	// When a link is clicked, the navigateTo function is called
	// The navigateTo function changes the URL and calls the router function 
	// to load the new view without reloading the page
	const links = document.querySelectorAll('[data-link]');
	links.forEach(link => {
		link.addEventListener("click", e => {
			e.preventDefault();
			navigateTo(link.href);
		});
	});

	// Animate letters
	animateLetters();
};

// Listen for the popstate event (back and forward buttons) and call the router function
window.addEventListener("popstate", router);

// ------------------------------- USER INTERACTION ANIMATIONS -------------------------------
// --- Changing letter animation
const animateLetters = () => {
	const letters = "abcdefghijklmnopqrstuvwxyz";

    let interval = null;

    const text = document.querySelector("h1");
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

// --- Interactive bubble
document.addEventListener('DOMContentLoaded', () => {
	const interBubble = document.querySelector('.interactive');
	if (!interBubble) return;

    let curX = 0;
    let curY = 0;
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