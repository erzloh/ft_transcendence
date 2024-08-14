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