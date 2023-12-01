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

babyObj.prototype.init = function(){
    this.x = canWidth*0.5;
    this.y = canHeight * 0.5;
    this.angle = 0;
    //眼睛 2 身体 20 尾巴 8
    for(var i=0;i<2;i++)
    {
        this.babyEye[i] = new Image();
        this.babyEye[i].src = "res/babyEye"+i+".png";
    }

    for(var i=0;i<20;i++)
    {
        this.babyBody[i] = new Image();
        this.babyBody[i].src = "res/babyFade"+i+".png";
    }

    for(var i=0;i<8;i++)
    {
        this.babyTail[i] = new Image();
        this.babyTail[i].src = "res/babyTail"+i+".png";
    }
}

babyObj.prototype.draw = function(){
    this.x = lerpDistance(mom.x,this.x,0.99);
    this.y = lerpDistance(mom.y,this.y,0.98);

    //调整小鱼角度
    var deltaX = mom.x - this.x;
    var deltaY = mom.y - this.y;
    var beta = Math.atan2(deltaY,deltaX)+Math.PI;
    this.angle = lerpAngle(beta,this.angle,0.9);

    ctx1.save();
    ctx1.translate(this.x,this.y);
    ctx1.rotate(this.angle);
    ctx1.drawImage(this.babyBody[0],-this.babyBody[0].width*0.5,-this.babyBody[0].height*0.5);
    ctx1.drawImage(this.babyTail[0],-this.babyTail[0].width*0.5+23,-this.babyTail[0].height*0.5);
    ctx1.drawImage(this.babyEye[0],-this.babyEye[0].width*0.5,-this.babyEye[0].height*0.5);
    ctx1.restore();
}