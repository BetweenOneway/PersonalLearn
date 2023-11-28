//大鱼
var momObj = function(){
    this.x;
    this.y;
    //游动的角度
    this.angle;
    this.bigEye = [];
    this.bigBody = [];
    this.bigTail = [];

    this.bigEyeIndex = 0;
    this.bigEyeStart = 0;
    this.bigEyeEnd = 3000;

    //尾巴的切换
    this.bigTailIndex = 0;
    this.bigTailStart = 0;
    this.bigTailEnd = 200;

    //身体的切换
    this.bigBodyIndex = 0;
    this.bigBodyStart = 0;
    this.bigBodyEnd = 4000;
}

momObj.prototype.init = function(){
    this.x = canWidth*0.5;
    this.y = canHeight*0.5;
    this.angle = 0;
    for(var i=0;i<2;i++)
    {
        this.bigEye[i] = new Image();
        this.bigEye[i].src = "res/bigEye"+i+".png";
    }

    for(var i=0;i<8;i++)
    {
        this.bigBody[i] = new Image();
        this.bigBody[i].src = "res/bigSwim"+i+".png";

        this.bigTail[i] = new Image();
        this.bigTail[i].src = "res/bigTail"+i+".png";
    }

}

momObj.prototype.draw = function(){

    this.bigEyeStart += deltaTime;
    if(this.bigEyeStart>this.bigEyeEnd)
    {
        this.bigEyeIndex = (this.bigEyeIndex+1)%2;
        this.bigEyeStart = 0;
        if(this.bigEyeIndex == 0)
        {
            this.bigEyeEnd = 3000;
        }
        if(this.bigEyeIndex == 1)
        {
            this.bigEyeEnd = 300;
        }
    }

    //尾巴切换
    this.bigTailStart+=deltaTime;
    if(this.bigTailStart > this.bigTailEnd)
    {
        this.bigTailIndex = (this.bigTailIndex+1)%8;
        this.bigTailStart = 0;

    }

    //身体的切换
    this.bigBodyStart += deltaTime;
    if(this.bigBodyStart>this.bigBodyEnd)
    {
        this.bigBodyIndex = (this.bigBodyIndex+1)%8;
        this.bigBodyStart = 0;
    }

    this.x = lerpDistance(mx,this.x,0.98);
    this.y = lerpDistance(my,this.y,0.98);

    //修改大鱼游动角度
    var deltaY = my - this.y;
    var deltaX = mx - this.x;
    var beta = Math.atan2(deltaY,deltaX) + Math.PI;
    
    this.angle = lerpAngle(beta,this.angle,0.9);

    ctx1.save();
    
    //将画布原点移动到大鱼身体中心
    ctx1.translate(this.x,this.y);
    ctx1.rotate(this.angle);

    ctx1.drawImage(this.bigBody[this.bigBodyIndex],-this.bigBody[this.bigBodyIndex].width*0.5,-this.bigBody[this.bigBodyIndex].height*0.5);
    ctx1.drawImage(this.bigTail[this.bigTailIndex],-this.bigTail[this.bigTailIndex].width*0.5+30,-this.bigTail[this.bigTailIndex].height*0.5);
    ctx1.drawImage(this.bigEye[this.bigEyeIndex],-this.bigEye[this.bigEyeIndex].width*0.5,-this.bigEye[this.bigEyeIndex].height*0.5);

    ctx1.restore();
}