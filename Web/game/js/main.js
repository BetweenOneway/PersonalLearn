
//两个画布的全局对象
var can1;
var can2;
//两个画笔的全局对象
var ctx1;
var ctx2;

var canWidth;
var canHeight;

//两帧画面之间的时间差
var lastTime;
//时间差
var deltaTime;

function game(){
    init();
    gameloop();
}

function init(){
    can1 = document.getElementById("canvas1");
    can2 = document.getElementById("canvas2");

    ctx1 = can1.getContext("2d");
    ctx2 = can2.getContext("2d");

    canWidth = can1.width;
    canHeight = can1.height;

    lastTime = Date.now();
    deltaTime = 0;
}

function gameloop(){
    requestAnimationFrame(gameloop);
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    console.log(deltaTime);
}

document.body.onload = game;