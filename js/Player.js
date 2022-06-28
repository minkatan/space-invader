export default class Player {

    rightPressed = false;
    leftPressed = false
    shootPressed = false;

    constructor(canvas, velocity, bulletController){
        this.canvas = canvas;
        this.velocity = velocity
        this.bulletController = bulletController

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
        this.width = 50;
        this.height = 48;
        this.image = new Image()
        this.image.src = "assets/images/player.png"

        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp)
    }

    draw(ctx) {
        if(this.shootPressed){
            this.bulletController.shoot(this.x + this.width/2, this.y, 4, 10)
        }
        this.move();
        this.collideWalls();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    collideWalls(){
        // left
        if(this.x < 0 ){
            this.x = 0;
        }

        // right
        if(this.x > this.canvas.width - this.width){
            this.x = this.canvas.width - this.width;
        }
    }

    move(){
        if(this.rightPressed){
            this.x += this.velocity;
        }else if (this.leftPressed){
            this.x += -this.velocity
        }
    }

    keyDown = e => {
        if(e.code === 'ArrowRight'){
            this.rightPressed = true;
        }
        if(e.code === 'ArrowLeft'){
            this.leftPressed = true
        }
        if(e.code === 'KeyS'){
            this.shootPressed = true
        }
    }

    keyUp = e => {
        if(e.code === 'ArrowRight'){
            this.rightPressed = false;
        }
        if(e.code === 'ArrowLeft'){
            this.leftPressed = false;
        }
        if(e.code === 'KeyS'){
            this.shootPressed = false;
        }
    }
}