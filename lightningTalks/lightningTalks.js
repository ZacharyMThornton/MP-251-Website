const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numberOfBalls = 200; // 100 seems to be the best

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

function Ball(posx, posy, radius){
    this.x = posx;
    this.y = posy;
    this.r = radius;
    this.direction = Math.random() > 0.5 ? -1 : 1;
    this.vely = 0; // starting y velocity
    this.velx = 0; // starting x velocity
    this.dampingFactor = -1*((1-0.6)*Math.random() + 0.6)

    this.terminalVel = 10; // terminal velocity
    this.grav = 0.3 // acceleration from gravity

    this.hasHit = false // true once ball has hit the bottom of the screen

    this.draw = function() {
        // draw ball to screen
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    this.fall = function(rect){
        if (this.x > rect.x - rect.width/2 && this.x < rect.x + rect.width/2){
            // top collision
            if ( (this.y < rect.y) && (this.y + this.r + this.vely > rect.y - rect.height/2) ){
                this.y = rect.y - rect.height/2 - this.r;
                this.vely = this.vely * this.dampingFactor; // apply damping factor for bounce
                this.velx = this.direction * this.vely * 0.25;
                console.log(this.r)
            }
        }

        this.y += this.vely;
        this.x += this.velx
        this.vely = this.vely + this.grav > this.terminalVel ? this.terminalVel : this.vely + this.grav;
    }
}

function Platform(width, height){
    this.x;
    this.y;
    this.width = width;
    this.height = height;

    this.draw = function(){
        if (Mouse.x != undefined){
            this.x = Mouse.x;
            this.y = Mouse.y;
            ctx.beginPath();
            ctx.rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
            ctx.fillstyle = gradient;
            ctx.fill();
        }
    }

}

let Mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove", function (event) {
    Mouse.x = event.x;
    Mouse.y = event.y;

})

let balls = [];
let platform = new Platform(150, 30);

for (let i = 0; i < numberOfBalls; i++){
    posx = (canvas.width) * Math.random();
    posy = (canvas.height) * Math.random()
    radius = (10)*Math.random()
    balls.push(new Ball(posx, posy, radius));
}

function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platform.draw();

    for (let i = 0; i < balls.length; i++){
        balls[i].draw();
        //balls[i].collisionDetect(platform);
        balls[i].fall(platform);
        if (balls[i].y >= canvas.height){
            if (balls[i].hasHit == false){
                balls[i].y = canvas.height;
                balls[i].vely = balls[i].vely * balls[i].dampingFactor; // apply damping factor for bounce
                balls[i].velx = balls[i].direction * balls[i].vely * 0.25;
                balls[i].hasHit = true;
            }else{
                balls[i].hasHit = false;
                balls[i].x = (canvas.width) * Math.random();
                balls[i].y = 0;
                balls[i].velx = 0;
                balls[i].r = (10)*Math.random();
                //console.log(balls[i].hasHit);
            }
        }
    }

}

animate();
