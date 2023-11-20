
//两个画布的全局对象
var frontCanvas;
var backgroundCanvas;
//两个画笔的全局对象
var ctx1;
var ctx2;

var canWidth;
var canHeight;

//两帧画面之间的时间差
var lastTime;
//时间差
var deltaTime;

//背景图片对象
var bgPic;

function game(){
    init();
    gameloop();
}

function init(){
    frontCanvas = document.getElementById("canvas1");
    backgroundCanvas = document.getElementById("canvas2");

    ctx1 = frontCanvas.getContext("2d");
    ctx2 = backgroundCanvas.getContext("2d");

    canWidth = frontCanvas.width;
    canHeight = frontCanvas.height;

    lastTime = Date.now();
    deltaTime = 0;

    bgPic = new Image();
    bgPic.src = "./res/background.jpg"
}

function gameloop(){
    requestAnimationFrame(gameloop);
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    
    ctx2.drawImage(bgPic,0,0);
}

document.body.onload = game;