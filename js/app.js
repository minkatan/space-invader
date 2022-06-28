import EnemyContoller from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.width = 600;
canvas.height = 600;

const background = new Image();
background.src = "./assets/images/space.png"

const playerBulletController = new BulletController(canvas, 10, "red", true) //number of bullet, color, sound
const enemyBulletController = new BulletController(canvas, 10, "yellow", false) //number of bullet, color, sound
const enemyController = new EnemyContoller(canvas, enemyBulletController, playerBulletController);
const player = new Player(canvas ,3, playerBulletController);

let isGameOver = false;
let didWin = false;

function game(){
    checkGameOver();
    ctx.drawImage(background,0,0,canvas.width, canvas.height);
    displayGameOver();
    if(!isGameOver) {
        enemyController.draw(ctx)
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx)
    }
}

function checkGameOver(){
    if(isGameOver){
        return;
    }
    if(enemyBulletController.collide(player)){
        isGameOver = true;
    }

    if(enemyController.collide(player)){
        isGameOver = true
    }

    if(enemyController.enemyRows.length === 0){
        didWin = true;
        isGameOver = true;
    }
}

function displayGameOver(){
    if(isGameOver){
        let text = didWin ? "You Win!" : "Game Over!";
        let textOffset = didWin ? 3.5 : 5;

        ctx.fillStyle = "white";
        ctx.font = "70px Arial"
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2)
    }
}

setInterval(game, 1000 / 60);

const restartBtn = document.getElementById('restart-btn')

restartBtn.addEventListener('click',restart)

function restart (){
    window.location.reload()
}