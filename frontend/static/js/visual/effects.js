// ------------------------------- FRONTEND EYE CANDIES -------------------------------
// Changing letter animation

export const animateLetters = () => {
    const text = document.querySelector("[animated-letters]");
    if (!text) return;
	const letters = "abcdefghijklmnopqrstuvwxyz";
	const initialText = text.innerText;

    let interval = null;
    let iteration = 0;

	interval = setInterval(() => {
		text.innerText = text.innerText
			.split("")
			.map((letter, index) => {
				if (index < iteration) {
					return initialText[index];
				}
				return letters[Math.floor(Math.random() * 26)];
			})
			.join("");

		if (iteration >= initialText.length) { 
			clearInterval(interval);
		}

		iteration += 1 / 3;
	}, 30);
};

// Background noise animation
export const moveNoise = () => {
	const noiseElement = document.querySelector('.background-noise');
	
	const randomX = Math.floor(Math.random() * window.innerWidth);
	const randomY = Math.floor(Math.random() * window.innerHeight);

	noiseElement.style.backgroundPosition = `${randomX}px ${randomY}px`;
}

// init load transition
export const initLoadTransition = () => {
	const upperRect = document.getElementById("upper-transition-rectangle");
	const lowerRect = document.getElementById("lower-transition-rectangle");
  
	upperRect.addEventListener("animationend", function () {
	  upperRect.style.display = "none";
	});
  
	lowerRect.addEventListener("animationend", function () {
	  lowerRect.style.display = "none";
	});
  }

  // Load transition
export const loadTransition = () => {
	const upperRect = document.getElementById("upper-transition-rectangle");
	const lowerRect = document.getElementById("lower-transition-rectangle");
  
	upperRect.style.display = "block";
	upperRect.style.top = "0";

	lowerRect.style.display = "block";
	lowerRect.style.top = "50%";
  }