const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient = ctx.createLinearGradient(100,50,canvas.width,canvas.height);
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.16, 'orange');
gradient.addColorStop(2* 0.16, 'yellow');
gradient.addColorStop(3* 0.16, 'green');
gradient.addColorStop(4* 0.16, 'blue');
gradient.addColorStop(5* 0.16, 'indigo');

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //resize gradient to fit screen
    gradient = ctx.createLinearGradient(100,50,canvas.width,canvas.height);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.16, 'orange');
    gradient.addColorStop(2* 0.16, 'yellow');
    gradient.addColorStop(3* 0.16, 'green');
    gradient.addColorStop(4* 0.16, 'blue');
    gradient.addColorStop(5* 0.16, 'indigo');
})

function Ball(posx, posy, radius, color) {
    this.posx = posx;
    this.posy = posy;
    this.radius = radius;
    this.color = color;

    // this is the radius it will detect the mouse in
    this.outterRadius = radius * 20;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(posx, posy, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    this.detect = function (mousex, mousey) {
        // if the mouse is within the ball's x position
        if (mousex < this.posx + this.outterRadius && mousex > this.posx - this.outterRadius){
            // if the mouse is within the ball's y poisiton
            if (mousey > this.posy - this.outterRadius && mousey < this.posy + this.outterRadius){
                // if the distance between the ball and the mouse is less than or equal to the balls outer radius
                distance = Math.sqrt( Math.pow((this.posx - mousex), 2) + Math.pow((this.posy - mousey), 2));
                if (distance <= this.outterRadius){
                    // draw line between the ball and the mouse
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(mousex, mousey);
                    ctx.lineTo(this.posx, this.posy);
                    ctx.strokeStyle = gradient;
                    ctx.stroke();
                }
            }
        }
    }

}

var Mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener("mousemove", function (event) {
    Mouse.x = event.x;
    Mouse.y = event.y;
})


let balls = [];

for (let i = 0; i < 200; i++){
    posx = Math.random() * canvas.width;
    posy = Math.random() * canvas.height;
    radius = Math.random() * 15;
    color = gradient;
    balls.push(new Ball(posx, posy, radius, color));
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++){
        balls[i].draw();
        balls[i].detect(Mouse.x, Mouse.y);
    }

}

animate();
