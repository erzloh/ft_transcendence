	
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');

	canvas.width = window.innerWidth * 0.75;
	canvas.height = window.innerHeight * 0.60;
	//console.log(canvas.width);
	//console.log(canvas.height);

	let	isPaused = false;

	const startButton = document.getElementById('startButton');
	startButton.addEventListener('click', startGame);

	function startGame() {
		//console.log("game started bien ouej");
	//	startButton.disabled = true;
		if (startButton) {
  	      startButton.parentNode.removeChild(startButton);
		}
		gameLoop();
	}

	const keyPressed = [];
	const RIGHT_UP = 38;
	const RIGHT_DOWN = 40;
	const LEFT_UP = 87;
	const LEFT_DOWN = 83;

	window.addEventListener('keydown', function (e) {
		//console.log(e.keyCode); //prints the pressed key in console
		keyPressed[e.keyCode] = true;
	});

	window.addEventListener('keyup', function (e) {
		//console.log(e.keyCode); //prints the pressed key in console
		keyPressed[e.keyCode] = false;
	});

	window.addEventListener('keydown', function(e) {
		if (e.code === 'Space') {
			togglePause();
		}
	});

	function togglePause() {
		isPaused = !isPaused;
		if (!isPaused) {
			gameLoop(); // Continue the game if it was paused
		}
	}


	function	vec2(x, y) {
		return	{x: x, y: y};
	}

	function	Ball(pos, velocity, radius) {
		this.pos = pos;
		this.velocity = velocity;
		this.radius = radius;

		this.update = function() {
			this.pos.x += this.velocity.x;
			this.pos.y += this.velocity.y;
		};

		this.draw  = function () {
			context.fillStyle = "#33ff00";
			context.strokeStyle = "#33ff00";
			context.beginPath();
			context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
			context.fill();
			context.stroke();

		};
	}

	function	Map(pos, width, height) {
		this.pos = pos;
		this.width = width;
		this.height = height;

		this.draw = function () {
			context.fillStyle = "33ff00";
			context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		};
	};

	function	Paddle(pos, velocity, width, height) {
		this.pos = pos;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
		this.score = 0;

		this.updateLeft = function () {
			if (keyPressed[LEFT_UP]) {
				this.pos.y -= this.velocity.y;
			}
			if (keyPressed[LEFT_DOWN]) {
				this.pos.y += this.velocity.y;
			}
		};

		this.updateRight = function () {
			if (keyPressed[RIGHT_UP]) {
				this.pos.y -= this.velocity.y;
			}
			if (keyPressed[RIGHT_DOWN]) {
				this.pos.y += this.velocity.y;
			}
		};

		this.draw = function () {
			context.fillStyle = "#33ff00";
			context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		};

		this.getHalfWidth = function () {
			return this.width / 2;
		};

		this.getHalfHeight = function () {
			return this.height / 2;
		};

		this.getCenter = function () {
			const testx = this.getHalfWidth();
			const testy = this.getHalfHeight();
			return vec2(
				this.pos.x + testx,
				this.pos.y + testy,
			);
		};
	}

	function	paddleEdgeCollision(paddle) {

		if (paddle.pos.y <= 0) {
			paddle.pos.y = 0;
		}
		if (paddle.pos.y + paddle.height >= canvas.height) {
			paddle.pos.y = canvas.height - paddle.height;
		}
	}

	function	ballEdgeCollision(ball) {
		if (ball.pos.y + ball.radius >= canvas.height) {
			ball.velocity.y *= -1;
		}
		/*if (ball.pos.x + ball.radius >= canvas.width) {
			ball.velocity.x *= -1;
		}
		if (ball.pos.x - ball.radius <= 0) {
			ball.velocity.x *= -1;
		}

		*/
		if (ball.pos.y - ball.radius <= 0) {
			ball.velocity.y *= -1;
		}

	}

	function	ballPaddleCollision(ball, paddle) {

		let	dx = Math.abs(ball.pos.x - paddle.getCenter().x); //abs to get positive value;
		let	dy = Math.abs(ball.pos.y - paddle.getCenter().y);

		if (dx <= (ball.radius + paddle.getHalfWidth()) && dy <= (paddle.getHalfHeight() + ball.radius)) {
			ball.velocity.x *= -1;
		}
	}

	function	respawnBall(ball) {
		if (ball.velocity.x > 0) {
			ball.pos.x = canvas.width - 150;
			ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
		}

		if (ball.velocity.x < 0) {
			ball.pos.x = 150;
			ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
		}

		ball.velocity.x *= -1;
		ball.velocity.y *= -1;
	}

	function	increaseScore(ball, paddleLeft, paddleRight) {
		if (ball.pos.x <= -ball.radius) {
			paddleRight.score += 1;
			document.getElementById("player2Score").innerHTML = paddleRight.score;
			respawnBall(ball);
		}

		if (ball.pos.x >= canvas.width + ball.radius) {
			paddleLeft.score += 1;
			document.getElementById("player1Score").innerHTML = paddleLeft.score;
			respawnBall(ball);
		}
	}


	//function	Map(pos, width, height) {

	const ball = new Ball(vec2(200, 200), vec2(canvas.width / 69, canvas.height / 69), 20);
	const paddleLeft = new Paddle(vec2(75, 50), vec2(canvas.width / 69, canvas.height / 69), 20, 160);
	const paddleRight = new Paddle(vec2(canvas.width - 95, 50), vec2(canvas.width / 69, canvas.height / 69), 20, 160);
	const mapTop = new Map(vec2(0, 0), canvas.width, 20);
	const mapBot= new Map(vec2(0, canvas.height - 20), canvas.width, 20);
	const mapMid = new Map(vec2(canvas.width / 2, 0), 20, canvas.height);


	function	gameUpdate() {
		ball.update();
		paddleRight.updateRight();
		paddleLeft.updateLeft();
		paddleEdgeCollision(paddleLeft);
		paddleEdgeCollision(paddleRight);
		ballEdgeCollision(ball);
		ballPaddleCollision(ball, paddleLeft);
		ballPaddleCollision(ball, paddleRight);

		increaseScore(ball, paddleLeft, paddleRight);
	}

	function	gameDraw() {
		paddleLeft.draw();
		paddleRight.draw();
		mapTop.draw();
		mapBot.draw();
		mapMid.draw();
		ball.draw();
	}


	function	gameLoop() {
		//context.clearRect(0, 0, canvas.width, canvas.height);
		if (isPaused) {
			//pause text
			return;
		}
		context.fillStyle = "rgba(0, 0, 0, 0.2)";
		context.fillRect(0, 0, canvas.width, canvas.height);
		window.requestAnimationFrame(gameLoop);
		//context.clearRect(0, 0, canvas.width, canvas.height);

		gameUpdate();
		gameDraw();
	}


//		gameLoop();

	/*

	context.fillStyle = "#ff0000";
	context.fillRect(100, 100, 50, 50);

	context.fillStyle = "#ff00ff";
	context.strokeStyle = "#ff00ff";
	context.beginPath();
	context.arc(200, 200, 50, 0, Math.PI * 2);
	context.fill();
	context.stroke();
	*/
