let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let img1 = new Image();
img1.src = 'rex.png';
let img2 = new Image();
img2.src = 'cactus.png';


let dino = {
    x : 50,
    y : 200,
    width : 50,
    height : 50,

    draw(){
        ctx.fillStyle = 'green';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img1, this.x, this.y);
    }
}

class Cactus{
    constructor(){
        this.x = 500,
        this.y = 200,
        this.width = 50;
        this.height = 50;
    }
    
    draw(){
        ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img2, this.x, this.y);
    }
}

let timer = 0;
let cactuses = [];
let inJump = false;
let jumpTimer = 0;
let animation;

function playPerFrame(){
    animation = requestAnimationFrame(playPerFrame);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(timer % 120 === 0){
        let cactus = new Cactus();
        cactuses.push(cactus);
    }
    cactuses.forEach((a, i, o) => {
        if(a.x < 0) o.splice(i,1);
        a.x -=3;

        isCollision(dino, a);

        a.draw();
    })

    if(inJump == true){
        dino.y -= 2;
        jumpTimer++;
    } 
    else if(dino.y < 200){
        dino.y += 2;
    }
    if(jumpTimer > 50){
        inJump = false;
    }
    if(dino.y === 200) {
        jumpTimer=0;
    }
    
    
    dino.draw();
}

playPerFrame();

//충돌 확인
function isCollision(dino, cactus){
    const x = cactus.x - (dino.x + dino.width);
    const y = cactus.y - (dino.y + dino.height);
    
    if(x < 0 && y < 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);    
    }
}

document.addEventListener('keydown',function(e){
    if(e.code === 'Space'){
        inJump = true;
    }
})