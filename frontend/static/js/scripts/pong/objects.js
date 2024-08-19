export class Ball {
    constructor(x, y, size, color, speed, dx, dy) {
        this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.speed = speed;
		this.dx = dx;
		this.dy = dy;
    }
}

export class Pad {
	constructor(x, y, width, height, color, dy) {
        this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.dy = dy;
		this.score = 0;
    }
}