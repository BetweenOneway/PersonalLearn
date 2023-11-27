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

    ctx1.save();
    
    //将画布原点移动到大鱼身体中心
    ctx1.translate(this.x,this.y);
    ctx1.rotate(this.angle);

    ctx1.drawImage(this.bigBody[0],-this.bigBody[0].width*0.5,-this.bigBody[0].height*0.5);
    ctx1.drawImage(this.bigTail[0],-this.bigTail[0].width*0.5+30,-this.bigTail[0].height*0.5);
    ctx1.drawImage(this.bigEye[this.bigEyeIndex],-this.bigEye[this.bigEyeIndex].width*0.5,-this.bigEye[this.bigEyeIndex].height*0.5);

    ctx1.restore();
}