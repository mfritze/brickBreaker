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

initializeBricks();
setInterval(draw, 8);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function draw() {
    context.clearRect(0,0, canvas.width, canvas.height);

    if ( ballY + dy == ballRadius){
        dy = -dy;
    }
    else if (ballY + dy == canvas.height - (ballRadius + paddleHeight) &&
        ballX >= paddleX && ballX <= paddleX + paddleWidth ) {
        dy = -dy;
    }else if (ballY + dy == canvas.height - ballRadius){
        alert("Game over bruh");
        document.location.reload();
    }

    if ( ballX + dx == canvas.width - ballRadius || ballX + dx == ballRadius){
        dx = -dx;
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    brickCollisionDetection();
    drawPaddle();
    drawBall();
    drawBricks();
    ballX += dx;
    ballY += dy;
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
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }
}

function brickCollisionDetection() { // TODO this should be more sophisticated by checking with radius of the ball
    //for (var c = 0; c < brickColumnCount; c++) {
    //    for (var r = 0; r < brickRowCount; r++) {
    //        var brick = bricks[c][r];
    //        if (brick.status == 1) {
    //            if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y+brickHeight) {
    //                dy = -dy;
    //                brick.status = 0;
    //            }
    //        }
    //    }
    //}
    for (var i = 0; i < brickList.length; i++){
        var brick = brickList[i];
        var fX = ballX + dx; // future x
        var fY = ballY + dy; // future y
        var topEdge = brick.y;
        var bottomEdge = brick.y + brickHeight;
        var leftEdge = brick.x;
        var rightEdge = brick.x + brickWidth;

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

            // Bottom
            if  ((ballY > bottomEdge)&&
               (((ballX > rightEdge) && ((bottomEdge - fY) <= (rightEdge - fX)) ) ||
                ((ballX < leftEdge ) && ((bottomEdge - fY) <= (leftEdge  - fX)) ) ||
                 (ballX <= rightEdge && ballX >= leftEdge) )
               ){
                dy = -dy;
            }

            brickList.splice(i, 1);
        }

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
        var bonus = true;
        brickList.push( {x: brickX, y: brickY, bonus: bonus});
    }
}
