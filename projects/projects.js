refreshButton = document.getElementById('refresh');
refreshButton.addEventListener('click', function () {
    location.reload();
})

// canvas set up
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// linear gradient that is the canvas background
let gradient = ctx.createLinearGradient(100,50,canvas.width,canvas.height);
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.16, 'orange');
gradient.addColorStop(2* 0.16, 'yellow');
gradient.addColorStop(3* 0.16, 'green');
gradient.addColorStop(4* 0.16, 'blue');
gradient.addColorStop(5* 0.16, 'indigo');

// mouse object for x and y components
let Mouse = {
    x: undefined,
    y: undefined
}

// grid settings
let pixelRes = 5;
var grid = [];
let numOfRows = Math.ceil(canvas.height/pixelRes);
let numOfCols = Math.ceil(canvas.width/pixelRes);

// create initial grid
for (let i = 0; i < numOfRows; i++){
    grid.push([]);
    for (let j = 0; j < numOfCols; j++){
        grid[i].push(0);
    }
}

window.addEventListener("resize", function(){
    // resize the canvas to the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // remake the gradient to fit page
    gradient = ctx.createLinearGradient(100,50,canvas.width,canvas.height);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.16, 'orange');
    gradient.addColorStop(2* 0.16, 'yellow');
    gradient.addColorStop(3* 0.16, 'green');
    gradient.addColorStop(4* 0.16, 'blue');
    gradient.addColorStop(5* 0.16, 'indigo');

    // recalculate the number of rows and columns
    numOfRows = Math.ceil(canvas.height/pixelRes);
    numOfCols = Math.ceil(canvas.width/pixelRes);

    // adjust the grid size
    while(grid.length > numOfRows){
        grid.pop();
        console.log(grid)
    }
    while(grid.length < numOfRows){
        grid.push(Array(numOfCols).fill(0));
    }

    for (let i = 0; i < grid.length; i++){
        while(grid[i].length > numOfCols){
            grid[i].pop();
        }
        while(grid[i].length < numOfCols){
            grid[i].push(0);
        }
    }
})

window.addEventListener("mousemove", function (event) {
    Mouse.x = event.x;
    Mouse.y = event.y;
})

document.addEventListener('mousedown', startContinuousEvent);
document.addEventListener('mouseup', stopContinuousEvent);

let intervalId; // Store the interval ID to clear it later

function startContinuousEvent() {

    // make this event run continuously
    intervalId = setInterval(() => {
        blockx = Math.floor(Mouse.x/pixelRes);
        blocky = Math.floor(Mouse.y/pixelRes);

        // if (grid[blocky][blockx] == 0){
        //     grid[blocky][blockx] = 1;
        // }
        for (let i = 0; i < 10; i++){
            if(blockx - i > 0 && blocky - i > 0){
                if(blockx + i < grid[0].length && blocky + i < grid.length){
                    if (grid[blocky][blockx + i] == 0 && Math.random() < 0.50){
                        grid[blocky][blockx + i] = 1;
                    }
                    if (grid[blocky][blockx - i] == 0 && Math.random() < 0.50){
                        grid[blocky][blockx - i] = 1;
                    }
                    // if (grid[blocky + i][blockx] == 0 && Math.random() < 0.50){
                    //     grid[blocky + i][blockx] = 1;
                    // }
                    // if (grid[blocky - i][blockx] == 0 && Math.random() < 0.50){
                    //     grid[blocky - i][blockx] = 1;
                    // }
                    console.log("hello");
                }
            }
        }

    }, 10);
}

function stopContinuousEvent() {
    // stop the mouse event when the mouse is let go
    clearInterval(intervalId); 
}


let fps = 60; // Target frame rate
let then = performance.now();
let interval = 1000 / fps;

function animate() {
  // Calculate time elapsed since the last frame
  let now = performance.now();
  let delta = now - then;

  // Update the animation if enough time has passed
  if (delta > interval) {
    // clear the screen before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //fill canvas with linear gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width, canvas.height)

    // color of non placed blocks
    ctx.fillStyle = "black";

    // color in any item in the array that is 0 black
    for (let i = 0; i < grid.length; i++){
        for (let j = 0; j < grid[0].length; j++){
            if (grid[i][j] === 0){
                ctx.fillRect(j*pixelRes, i*pixelRes, pixelRes, pixelRes);
            }
        }
    }

    // sand logic

    for (let i = grid.length - 2; i >= 0; i--) {
        const nextGrid = grid.map(row => [...row]); // copy of grid
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 1) {
                if (grid[i + 1][j] === 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i + 1][j] = 1;
                } else if (j + 1 < grid[0].length && grid[i + 1][j + 1] === 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i + 1][j + 1] = 1;
                } else if (j - 1 >= 0 && grid[i + 1][j - 1] === 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i + 1][j - 1] = 1;
                }
            }
        }
        grid = nextGrid; // Update grid
    }
    
    

    // Update the last frame time
    then = now - (delta % interval); 
  }

  // create recursive loop
  requestAnimationFrame(animate);
}

animate();

