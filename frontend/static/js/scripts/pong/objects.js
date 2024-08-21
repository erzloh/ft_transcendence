export class Ball {
    constructor(x, y, size, color, speed, dx, dy, maxY, maxX, leftPad, rightPad, scorePoint) {
        this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.speed = speed;
		this.dx = dx;
		this.dy = dy;
		this.maxY = maxY;
		this.maxX = maxX;
		this.leftPad = leftPad;
		this.rightPad = rightPad;
		this.scorePoint = scorePoint;
    }

	collisionDetect(pad) {
		pad.top = pad.y;
		pad.bottom = pad.y + pad.height;
		pad.left = pad.x;
		pad.right = pad.x + pad.width;

		this.top = this.y;
		this.bottom = this.y + this.size;
		this.left = this.x;
		this.right = this.x + this.size;

		return pad.left < this.right && pad.top < this.bottom && pad.right > this.left && pad.bottom > this.top;
	}

	move() {
		this.x += this.dx;
		this.y += this.dy;

		if (this.y + this.size > this.maxY || this.y < 0) {
			this.dy *= -1;
		}

		let currentPad = (this.x < this.maxX / 2) ? this.leftPad : this.rightPad;

		if (this.collisionDetect(currentPad)) {
			this.dx *= -1;
			this.speed += 0.2;
			this.dx = this.dx > 0 ? this.speed : -this.speed;
			this.dy = this.dy > 0 ? this.speed : -this.speed;
		}

		if (this.x + this.size > this.maxX) {
			this.scorePoint("left");
		} 
		else if (this.x < 0) {
			this.scorePoint("right");
		}
	}

	resetPosition() {
		this.x = this.maxX / 2;
		this.y = this.maxY / 2;
		this.speed = 4;
		
		if (Math.random() > 0.5) {
			this.dx = this.speed;
		} 
		else {
			this.dx = -this.speed;
		}
		if (Math.random() > 0.5) {
			this.dy = this.speed;
		} 
		else {
			this.dy = -this.speed;
		}
	}
}

export class Pad {
	constructor(x, y, width, height, color, dy, maxY, isAI) {
        this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.dy = dy;
		this.maxY = maxY;
		this.isAI = isAI;
		this.score = 0;
		this.direction = "";
    }

	move() {		
		if (!this.isAI) {
			if (this.direction == "up" && this.y > 0) {
				this.y -= this.dy;
			} 
			else if (this.direction == "down" && this.y < this.maxY) {
				this.y += this.dy;
			}
		}
		else {
			if (this.rightPad.y + this.rightPad.height / 2 < this.ball.y) {
				this.rightPad.y += this.rightPad.dy;
			} else {
				this.rightPad.y -= this.rightPad.dy;
			}
		}
	}
}