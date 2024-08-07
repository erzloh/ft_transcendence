document.addEventListener('DOMContentLoaded', () => {
	const mode1v1Btn = document.getElementById('1v1-btn');
	const cpuBtn = document.getElementById('cpu-btn');
  
	mode1v1Btn.addEventListener('click', () => {
		console.log("wtffffff");
		startGame('1v1');
	});
  
	cpuBtn.addEventListener('click', () => {
		console.log("wtffffff");
		startGame('cpu');
	});
  });
  
  function startGame(mode) {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');
  
	// Réinitialisez le jeu ici si nécessaire
	initGame(mode, context, canvas);
  }