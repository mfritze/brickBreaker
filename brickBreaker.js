/**
 * Created by matthewfritze on 2015-09-04.
 */
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var ballX = canvas.width/2;
var ballY = canvas.height - 30;
var ballRadius = 10;
var dx = 1;
var dy = -1;
var paddleHeight = 20;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var leftPressed = false;
var rightPressed = false;
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickList = [];
var brickColors = ["#FD5961", "#FA9D82", "#EBE395", "#78AD88", "#08576B"];
var total = brickRowCount * brickColumnCount;

var intervalID = setInterval(draw, 8);
initializeBricks();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function draw() {
    context.clearRect(0,0, canvas.width, canvas.height);
    move();
    wallCollisionDetection();
    brickCollisionDetection();
    paddleCollision();
    checkVictory();
    ballX += dx;
    ballY += dy;
    drawPaddle();
    drawBall();
    drawBricks();
}

function drawBall(){
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawPaddle(){
    context.beginPath();
    context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawBricks() {
    // Draw only the bricks that remain
    for(var i = 0; i < brickList.length; i++) {
        var brick = brickList[i];
        context.beginPath();
        context.rect(brick.x, brick.y, brickWidth, brickHeight);
        context.fillStyle = brickColors[brick.lives];
        context.fill();
        context.closePath();
    }
}


function brickCollisionDetection() {
    for (var i = 0; i < brickList.length; i++){
        var brick = brickList[i];
        var fX = ballX + dx; // future x
        var fY = ballY + dy; // future y
        var topEdge = brick.y - ballRadius;
        var bottomEdge = brick.y + brickHeight + ballRadius;
        var leftEdge = brick.x - ballRadius;
        var rightEdge = brick.x + brickWidth + ballRadius;

        // Any collision
        if (( leftEdge <= fX && fX <= rightEdge) &&
            ( topEdge <= fY && fY <= bottomEdge)){

            // Right - check the ball is to the right of the block, and that it will hit the side edge first
            if   ((ballX > rightEdge) &&
                (((ballY > bottomEdge) && ((rightEdge - fX) <= (bottomEdge - fY)) ) ||
                 ((ballY < topEdge)  && ((rightEdge - fX) <= (topEdge - fY)) ) ||
                  (ballY <= bottomEdge && ballY >= topEdge ) )
                ){
                dx = -dx;
            }

            if   ((ballX < leftEdge) &&
                (((ballY > bottomEdge) && ((leftEdge - fX) <= (bottomEdge - fY)) ) ||
                ((ballY < topEdge)  && ((leftEdge - fX) <= (topEdge - fY)) ) ||
                (ballY <= bottomEdge && ballY >= topEdge ) )
            ){
                dx = -dx;
            }

            // Bottom
            if  ((ballY > bottomEdge)&&
               (((ballX > rightEdge) && ((bottomEdge - fY) <= (rightEdge - fX)) ) ||
                ((ballX < leftEdge ) && ((bottomEdge - fY) <= (leftEdge  - fX)) ) ||
                 (ballX <= rightEdge && ballX >= leftEdge) )
               ){
                dy = -dy;
            }

            if  ((ballY < topEdge)&&
                (((ballX > rightEdge) && ((topEdge - fY) <= (rightEdge - fX)) ) ||
                ((ballX < leftEdge ) && ((topEdge - fY) <= (leftEdge  - fX)) ) ||
                (ballX <= rightEdge && ballX >= leftEdge) )
            ){
                dy = -dy;
            }
            brickList[i].lives -= 1;
            if(brickList[i].lives == -1){
                brickList.splice(i,1);
            }
        }

    }
}

function wallCollisionDetection() {
    if ( ballY + dy == ballRadius){
        dy = -dy;
    }else if (ballY + dy == canvas.height - ballRadius){
        alert("Game over bruh");
        document.location.reload();
    }
    if ( ballX + dx == canvas.width - ballRadius || ballX + dx == ballRadius){
        dx = -dx;
    }
}

function paddleCollision(){
    // coming from left  -> left paddle: slow down
    //                   -> right paddle : speed up
    // coming from right -> right paddle: slow down
    //                   -> left paddle : speed up
    // Middle third always remains constant.

    if (ballY + dy == canvas.height - (ballRadius + paddleHeight) &&
        ballX >= paddleX && ballX <= paddleX + paddleWidth ) {
        dy = -dy;
    }

}

function move(){
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0){
        paddleX -= 7;
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function initializeBricks() {
    for(i = 0; i < brickColumnCount * brickRowCount; i++) {
        var brickX = (i % brickColumnCount) * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = (i % brickRowCount) * (brickHeight + brickPadding) + brickOffsetTop;
        var lives = (Math.pow(i, 2) % 3) + (Math.pow((i+7), 2) %4);
        brickList.push( {x: brickX, y: brickY, lives: lives});
    }
}

function checkVictory() {
    if (brickList.length == 0){
        clearInterval(intervalID);
        context.clearRect(0,0, canvas.width, canvas.height);
        context.font = "40px Open Sans";
        context.fillStyle = "#0095DD";
        context.fillText("You Win! Play again?", canvas.width/2 - 120, canvas.height*(3/5));
    }
}