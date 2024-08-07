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

