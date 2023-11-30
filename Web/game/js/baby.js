//小鱼
var babyObj = function(){
    this.x;
    this.y;
    this.angle;

    this.babyEye = [];
    this.babyBody = [];
    this.babyTail = [];

    this.babyEyeIndex = 0;
    this.babyEyeStart = 0;
    this.babyEyeEnd = 3000;

    this.babyBodyIndex = 0;
    this.babyBodyStart = 0;
    this.babyBodyEnd = 4000;

    this.babyTailIndex = 0;
    this.babyTailStart = 0;
    this.babyTailEnd = 3000;
}

babyObj.prototype.init = function(){}

babyObj.prototype.draw = function(){}