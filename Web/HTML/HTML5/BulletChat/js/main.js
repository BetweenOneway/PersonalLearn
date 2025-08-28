//弹幕主管程序

//创建全局变量保存弹幕对象
var msg ;

var c3;
var ctx;
//保存画布宽度和高度
var canWidth;
var canHeight;
//保存输入框/颜色 字体 按钮
var inputMsg;
var inputColor;
var inputFont;
var inputBtn;

function game(){
    init();
    gameloop();
}

function init(){
    //
    c3 = document.getElementById("c3");
    ctx = c3.getContext("2d");
    canWidth = c3.width;
    canHeight = c3.height;

    inputMsg = document.getElementById("inputMsg");
    inputFont = document.getElementById("inputFont");
    inputColor = document.getElementById("inputColor");
    inputBtn = document.getElementById("inputBtn");

    //创建弹幕对象
    msg = new msgObj();
    msg.init();

    inputBtn.addEventListener("click",handleMsg);
}

function gameloop(){
    requestAnimationFrame(gameloop);
    msg.draw();
}

function handleMsg(){
    var m = {
        msg:inputMsg.value,
        font:inputFont.value,
        color:inputColor.value
    };

    msg.add(m);
}

document.body.onload = game;