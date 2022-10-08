//canvas setting
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

//canvas properties 
canvas.width = window.innerWidth - 100;
canvas.height = 500;

//scoreboard
let scoreboard = document.getElementById("score");

//image setting
let rexImg = new Image();
rexImg.src = "rex.png";
let cactusImg = new Image();
cactusImg.src = "cactus.png";

//initial position
const initRexX = 50;
const initRexY = 250;
const initRexWidth = 50;
const initRexHeight = 50;
const initCactusX = canvas.width - 100;
const initCactusY = 250;
const initCactusWidth = 50;
const initCactusHeight = 50;

//text for restart when game end
let restart = document.getElementById("restart");

//Playable character rex
let rex = {
    x : initRexX,
    y : initRexY,
    width : initRexWidth,
    height : initRexHeight,
    
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(rexImg, this.x, this.y, this.width, this.height);
    }
}

//hurdle cactus object
class Cactus {
    constructor(){
        this.x = initCactusX;
        this.y = initCactusY;
        this.width = initCactusWidth;
        this.height = initCactusHeight;
    }
    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(cactusImg, this.x, this.y, this.width, this.height);
    }
}

let timer = 0;          //timer for check time
let jumpTimer = 0;      //timer for check time in jumping
let isJumping = false;  //flag for jumping
let cactuses = [];      
let score = 0;          
let inGame = true;      //flag for game is playing

//animate for flame
function playEveryFrame(){
    const request = window.requestAnimationFrame(playEveryFrame);
    window.onkeydown = (e) => console.log(e);
    timer++; //every frame timer++ to calculating time
    ctx.clearRect(0,0,canvas.width,canvas.height); //Clear canvas for every frame to redrawing new position
    rex.draw();
    scoreboard.innerText = 'score :' + score;

    //make cactus obj
    if(timer % Math.floor(Math.random()*35 + 100) === 0){
        timer =  0;
        let cactus = new Cactus();
        cactuses.push(cactus);
    }
    //cactus check and draw
    cactuses.forEach((e, i, o) => {
        e.draw();
        e.x -= 4;
        if(e.x < 0){
            o.splice(i,1);
            score++;
        }
    });

    //collision check and game over
    cactuses.forEach((e) =>{
        const differenceX = e.x - (rex.x + rex.width);
        const differenceY = e.y - (rex.y + rex.height);

        if ((differenceX < 0 ) && (differenceY < 0)){
            console.log("end");
            window.cancelAnimationFrame(request);
            inGame = false;
            restart.innerText = "PRESS 'R' TO RESTART GAME"
        }
    })

    //jump
    if(isJumping){
        rex.y -= 2;
        jumpTimer++;
        if(jumpTimer > 50) isJumping = false;
    }
    else if(rex.y < 250){
        rex.y += 2;
        jumpTimer = 0;
    }
    
}

playEveryFrame();

//event listner
window.addEventListener('keypress', (a)=>{
    if(a.code === "Space") {
        console.log("space");
        if(rex.y === 250) isJumping = true;
    }
    else if(a.code === "KeyR" && !inGame ){
        console.log("restart");
        inGame = true;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        cactuses.splice(0,cactuses.length);
        //initial valuables
        rex.y = initRexY;
        restart.innerText ='';
        score = 0;
        isJumping = false;
        jumpTimer = 0;
        timer = 0;
        playEveryFrame();
    }
});

window.addEventListener('click', a =>{
    if(rex.y === 250) isJumping = true;
})