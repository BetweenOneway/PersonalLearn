//光环
var waveObj = function(){
    this.x = [];
    this.y = [];
    this.r = [];

    //状态 显示或隐藏
    this.alive = [];
}

waveObj.prototype.num = 10;

waveObj.prototype.init = function(){
    for(var i=0;i<this.num;i++)
    {
        this.alive[i] = false;
        this.x[i] = 0;
        this.y[i] = 0;
        this.r[i] = 0;
    }
}

waveObj.prototype.draw = function(){
    ctx1.save();

    ctx1.strokeStyle = "#FFF";
    for(var i=0;i<this.num;i++)
    {
        if(this.alive[i])
        {
            this.r[i] += deltaTime*0.015;
            if(this.r[i]>50)
            {
                this.alive[i] = false;
                //一次隐藏一个
                return;
            }
            ctx1.beginPath();
            ctx1.arc(this.x[i],this.y[i],this.r[i],0,2*Math.PI);
            ctx1.stroke();
        }
    }
    ctx1.restore();
}

waveObj.prototype.born = function(x,y){
    for(var i =0;i<this.num;i++)
    {
        if(this.alive[i] == false)
        {
            this.alive[i] = true;
            this.x[i] = x;
            this.y[i] = y;
            this.r[i] = 20;
            return;
        }
    }
}