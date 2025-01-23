const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ballInput = document.getElementById("ballInput");

// linear gradient that is the canvas background
let gradient = ctx.createLinearGradient(100,50,canvas.width,canvas.height);
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.16, 'orange');
gradient.addColorStop(2* 0.16, 'yellow');
gradient.addColorStop(3* 0.16, 'green');
gradient.addColorStop(4* 0.16, 'blue');
gradient.addColorStop(5* 0.16, 'indigo');

//const numberOfBalls = parseInt(window.prompt("how many balls"), 10);
let numberOfBalls = 200;

var Mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener("mousemove", function() {
    Mouse.x = event.x;
    Mouse.y = event.y;
})

window.addEventListener("resize", function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // resize gradient to fit screen
    gradient = ctx.createLinearGradient(100,50,canvas.width,canvas.height);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.16, 'orange');
    gradient.addColorStop(2* 0.16, 'yellow');
    gradient.addColorStop(3* 0.16, 'green');
    gradient.addColorStop(4* 0.16, 'blue');
    gradient.addColorStop(5* 0.16, 'indigo');
})

function Circle(x, y, r, color){
    this.x = x;
    this.y = y;
    this.r = r;
    this.velx = 0;
    this.vely = 0;
    this.color = color;

    this.draw = function() {
        // draw ball to screen
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    this.follow = function() {
        // follow logic for ball that follows your mouse
        if (Mouse.x != undefined && Mouse.y != undefined){
            let x_distance = Mouse.x - this.x;
            let y_distance = Mouse.y - this.y;

            let dx = x_distance * 0.05; // makes sure the ball doesn't go too fast
            let dy = y_distance * 0.05;

            this.x += dx; // add x position with change in x
            this.y += dy; // add y position with change in y

        }
    }

    this.attract = function(circle) {
        const maxVel = 10;
        const G = 2; // Gravitational constant (adjust as needed)
        const x_distance = circle.x - this.x;
        const y_distance = circle.y - this.y;
        const distance = Math.sqrt(x_distance * x_distance + y_distance * y_distance);
    
        if (distance > 0) { // Avoid division by zero
            const force = (G * this.r * circle.r) / (distance);
            const angle = Math.atan2(y_distance, x_distance); // Use atan2 for correct quadrant
    
            const ax = (force / this.r) * Math.cos(angle); 
            const ay = (force / this.r) * Math.sin(angle); 
    
            this.velx = Math.abs(this.velx + ax) > maxVel ? this.velx : this.velx + ax;
            this.vely = Math.abs(this.vely + ay) > maxVel ? this.vely : this.vely + ay;
    
            // Add velocity damping
            this.velx *= 0.99; 
            this.vely *= 0.99; 
    
            this.x += this.velx;
            this.y += this.vely;
        }
    }
}

mainBody = new Circle(100, 100, 20, gradient);
var gravBodies = [];

function createBalls(numberOfBalls, gravBodies){
    for (let i = 0; i < numberOfBalls; i++){
        // random radius from 0 - 15
        let r = Math.random() * 15;
        // makes sure teh balls don't spawn outside of view
        let x = Math.random() * (canvas.width - (r*2)) + r;
        let y = Math.random() * (canvas.height - (r*2)) + r;
        // adds new ball to list
        gravBodies.push(new Circle(x, y, r, gradient));
    }
}

createBalls(numberOfBalls, gravBodies);

window.addEventListener("keydown", function (event) {
    if (event.key == "Enter" && ballInput != null) {
        numberOfBalls = ballInput.value > 1000 ? 1000 : ballInput.value; // max out the number of balls to 1000
        gravBodies = []; // reset the list to be empty so it doesn't just add balls
        createBalls(numberOfBalls, gravBodies);
    }
})


function animate() {
    // create recursive loop
    requestAnimationFrame(animate);
    // clear the screen before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // main ball that follows mouse
    mainBody.draw();
    mainBody.follow();

    // balls that are attracted gravitationaly to mouse
    for (let i = 0; i < gravBodies.length; i++){
        gravBodies[i].draw();
        gravBodies[i].attract(mainBody);
    }

}

animate();
