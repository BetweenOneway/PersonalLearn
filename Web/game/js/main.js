
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

//全局变量保存海葵
var ane;

//食物对象
var food;

//大鱼对象
var mom;

//鼠标位置
var mx = 0, my = 0;

//分数
var score;

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

    ane = new aneObj();
    ane.init();

    food = new foodObj();
    food.init();

    mom = new momObj();
    mom.init();

    score = new scoreObj();

    frontCanvas.addEventListener("mousemove",hanleMove);
}

function gameloop(){
    requestAnimationFrame(gameloop);
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    
    ctx2.drawImage(bgPic,0,0);

    //画食物之前校验大鱼和食物的碰撞距离
    momFoodCollision();
    
    ane.draw();

    foodMonitor();
    
    food.draw();

    ctx1.clearRect(0,0,canWidth,canHeight);
    //
    mom.draw();

    score.draw();
}

function hanleMove(event)
{
    mx = event.offsetX;
    my = event.offsetY;
}

document.body.onload = game;