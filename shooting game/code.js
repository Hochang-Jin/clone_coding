//canvas setting
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1080;
canvas.height = 1920;

//player initial value
const playerIniWidth = 100;
const playerIniHeight = 100;
const playerIniX = (canvas.width - playerIniWidth)/2;
const playerIniY = canvas.height - 200;

//enemy initial value
const enemyIniX = canvas.width/2;
const enemyIniY = 50;
const enemyIniWidth = 100;
const enemyIniHeight = 100;

//image
const playerImg = new Image();
playerImg.src = "player.png";
const enemyImg = new Image();
enemyImg.src = "enemy.PNG";

/**player object */
let player = {
    x : playerIniX,
    y : playerIniY,
    width : playerIniWidth,
    height : playerIniHeight,
    /**player.draw() ==> draw player in canvas */
    draw(){
        ctx.fillStyle = 'green';
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    },
    init(){
        this.x = playerIniX;
        this.y = playerIniY;
        this.width = playerIniWidth;
        this.height = playerIniHeight;
    }
}

/**enemy class */
class Enemy{
    constructor(){
        this.x = enemyIniX + Math.random()*(canvas.width - enemyIniWidth) - (canvas.width - enemyIniWidth)/2;
        this.y = enemyIniY;
        this.width = enemyIniWidth;
        this.height = enemyIniHeight;
    }
    /**enemy.draw() */
    draw(){
        ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    }
}

/**bullet class */
class Bullet{
    constructor(){
        this.width = 20;
        this.height = 70;
        this.x = player.x + (player.width - this.width)/2;
        this.y = player.y;
    }
    draw(){
        ctx.fillStyle = 'burlywood';
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

//timer and other variable 
let timer = 0;
let reloadTimer = 0;
let enemies = [];
let bullets = [];
let bulletCreate = false;
let inGame = true;
const scoreBoard = document.getElementById("scoreboard");
let score = 0;
const restart = document.getElementById("restart");
restart.width = canvas.width ;

/**animate per frame */
function animatePerFrame(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    const request = window.requestAnimationFrame(animatePerFrame);
    timer++;

    player.draw();
    /**enemy create and push to enemies array */
    if(timer % 120 === 0){
        const enemy = new Enemy;
        enemies.push(enemy);
    }

    //enemies move in the y-axis direction
    enemies.forEach(e => {
        e.y += 10;
        e.draw();
    });
    
    //check enemies approach bottom of canvas and make game over
    enemies.forEach((e) => {
        if(e.y > canvas.height - e.height){
            inGame = false;
            window.cancelAnimationFrame(request);
            restart.innerText = "Press 'R' to restart";
        }
    })

    //if bullet create by keypress
    if(bulletCreate){
        reloadTimer++;
        if(reloadTimer == 30){
            reloadTimer = 0;
            bulletCreate = false;
        }
    }
    
    //drawing bullets
    bullets.forEach(e =>{
        e.y -= 10;
        e.draw();
    })

    //check bullets approach top of canvas
    bullets.forEach((e,i,o) => {
        if(e.y < 0 ){
            o.splice(i,1);
        }
    })

    //check bullet and enemy collision
    bullets.forEach((be,bi,bo)=>{
        enemies.forEach((ee,ei,eo) =>{
            const disX = be.x - ee.x;
            const disY = be.y - ee.y;
            const checkX = disX > -1 * be.width && disX < ee.width;
            const checkY = disY < ee.height && disY > -1 * be.height; 
            if(checkX && checkY){
                bullets = bo.slice(0,bi).concat(bo.slice(bi+1));
                enemies = eo.slice(0,ei).concat(eo.slice(ei+1));
                score++;
                scoreBoard.innerText = "SCORE: " + score;
            }
        })
    })
}

/**start game */
animatePerFrame();

//move function
function moveRight(){
    if(player.x < canvas.width - player.width) 
        player.x += 40;
    else    player.x = canvas.width - player.width;
}
function moveLeft(){
    if(player.x > 0) 
        player.x -= 40;
    else    player.x = 0;
}
function moveUp(){
    if(player.y > 100) 
        player.y -= 40;
    else    player.y = 100;
    
}
function moveDown(){
    if(player.y < canvas.height - player.height) 
        player.y += 40;
    else    player.y = canvas.height - player.height;    
}

/**code for multiple keydown*/
let keys = [];
//Arrow's keycode
const left = 37;
const right = 39;
const up = 38;
const down = 40;

window.addEventListener('keydown',keysPressed,false);
window.addEventListener('keyup',keysReleased,false);

function keysPressed(e){
    keys[e.keyCode] = true;

    //multiple keydown move
    if(keys[left] && keys[up]){
        moveLeft();
        moveUp();
    }
    if(keys[left] && keys[down]){
        moveLeft();
        moveDown();
    }
    if(keys[right] && keys[up]){
        moveRight();
        moveUp();
    }
    if(keys[right] && keys[down]){
        moveRight();
        moveDown();
    }
    //single keydown move
    if(keys[left] && !keys[right] && !keys[up] && !keys[down]) moveLeft();
    if(!keys[left] && keys[right] && !keys[up] && !keys[down]) moveRight();
    if(!keys[left] && !keys[right] && keys[up] && !keys[down]) moveUp();
    if(!keys[left] && !keys[right] && !keys[up] && keys[down]) moveDown();

}

function keysReleased(e){
    keys[e.keyCode] = false;
}

/**code for shooting bullets */
window.addEventListener('keypress',e =>{
    if(e.code === "Space" && !bulletCreate)
    {
        const bullet = new Bullet;
        bullets.push(bullet);
        bulletCreate = true;
    }
},false);

/**after game over */
window.addEventListener('keypress',e => {
    if(e.code === "KeyR"){
        if(!inGame){
            inGame = true;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            //initialize all valiables
            bullets.splice(0,bullets.length);
            enemies.splice(0,enemies.length);
            timer = 0;
            reloadTimer = 0;
            bulletCreate = false;
            score = 0;
            scoreBoard.innerText ="SCORE: " + score;
            restart.innerText = "";
            player.init();
            //restart
            window.requestAnimationFrame(animatePerFrame);
        }
    }
})