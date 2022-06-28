import Enemy from "./Enemy.js";
import Moving from "./Moving.js";

export default class EnemyContoller{
    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 3, 3, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];
    
    enemyRows = [];

    currentDirection = Moving.right;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownDefault = 30;
    moveDown = this.moveDownDefault;
    fireBulletTimerDefault = 100;
    fireBulletTimer = this.fireBulletTimerDefault;

    constructor(canvas, enemyBulletController, playerBulletController){
        this.canvas = canvas
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;

        this.enemyDeathSound = new Audio('assets/sounds/enemy-death.wav')
        this.enemyDeathSound.volume = 0.2 

        this.createEnemies()
    }

    draw(ctx){
        this.decrementMoveDown();
        this.updateVelocityAndDirection();
        this.collision();
        this.drawEnemies(ctx);
        this.resetMoveDown()
        this.fireBullet()
    }

    collision(){
        this.enemyRows.forEach((eRow) => {
            eRow.forEach((e,eIndex) => {
                if(this.playerBulletController.collide(e)){
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                    eRow.splice(eIndex,1);
                }
            });
        });
        this.enemyRows = this.enemyRows.filter((eRow) => eRow.length > 0)
    }

    drawEnemies(ctx){
        this.enemyRows.flat().forEach((e) => {
            e.move(this.xVelocity ,this.yVelocity)
            e.draw(ctx);
        })
    }

    createEnemies(){
        this.enemyMap.forEach((row,rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if(enemyNumber > 0){
                    this.enemyRows[rowIndex].push(new Enemy(
                        // to adjust distance between the enemy
                        enemyIndex * 50, rowIndex * 35, enemyNumber))
                }
            })
        })
    }

    

    fireBullet(){
        this.fireBulletTimer--;
        if(this.fireBulletTimer <= 0){
            this.fireBulletTimer = this.fireBulletTimerDefault;
            
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length)
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
        }
    }

    decrementMoveDown() {
        if(this.currentDirection === Moving.downLeft || 
            this.currentDirection === Moving.downRight){
            this.moveDown--
        }
    }

    resetMoveDown(){
        if(this.moveDown <=0){
            this.moveDown = this.moveDownDefault;
        }
    }

    updateVelocityAndDirection(){
        for (const enemyRow of this.enemyRows){
            if(this.currentDirection == Moving.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0
                
                const rightMost = enemyRow[enemyRow.length - 1];

                // down when hit the end of the canvas
                if(rightMost.x + rightMost.width >= this.canvas.width){
                    this.currentDirection = Moving.downLeft;
                    break;
                }

            } else if (this.currentDirection === Moving.downLeft) {
                if(this.movingDown(Moving.left)){
                    break;
                }
                // move left once move down
            } else if(this.currentDirection === Moving.left) {
                this.xVelocity = -this.defaultXVelocity
                this.yVelocity = 0;
                
                // move down when hit the left of the canvas
                const leftMost = enemyRow[0];
                if(leftMost.x <= 0) {
                    this.currentDirection = Moving.downRight
                    break;
                }
                // down right
            } else if(this.currentDirection === Moving.downRight){
                if(this.movingDown(Moving.right)){
                    break;
                }
            }
        }
    }

    movingDown(newDirection) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        
        if(this.moveDown <= 0){
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

    collide(sprite) {
        return this.enemyRows.flat().some(enemy => enemy.collide(sprite))
    }
}