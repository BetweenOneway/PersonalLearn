//弹幕功能

var msgObj = function(){
    this.m = [];//弹幕文字
    this.x = [];//弹幕坐标x
    this.y = [];//弹幕坐标y
    this.spd = [];//弹幕速度
    this.font = [];//弹幕字体
    this.color = [];//弹幕文字颜色
    this.alive = [];//弹幕状态 true 显示 false 隐藏
};

//弹幕数量
msgObj.prototype.num = 100;

msgObj.prototype.init = function(){
    for(var i=0;i<this.num;i++)
    {
        this.x[i] = canWidth;
        this.y[i] = 0;
        this.m[i] = "";
        this.font[i] = "12px";
        this.color[i] = "#000";
        this.spd[i] = 3;
        this.alive[i] = false;
    }
}

//将数据绘制到网站中
msgObj.prototype.draw = function(){
    ctx.clearRect(0,0,canWidth,canHeight);
    //
    for(var i=0;i<this.num;i++)
    {
        if(this.alive[i])
        {
            var m = this.m[i];
            var c = this.color[i];
            var f = this.font[i];
            var spd = this.spd[i];
            this.x[i] -= spd;
            //没有字体会失效
            ctx.font = f +" SimHei";
            ctx.fillStyle = c;
            ctx.fillText(m,this.x[i],this.y[i]);
            if(this.x[i]<0)
            {
                this.alive[i]=false;
                this.x[i] = canWidth;
            }
        }
    }
}

//将新弹幕添加到弹幕池中
//m={m:"666",color:"red",font:"22px"}
msgObj.prototype.add = function(m){
    for(var i=0;i<this.num;i++)
    {
        if(!this.alive[i])
        {
            this.alive[i]=true;
            this.font[i] = m.font;
            this.color[i]=m.color;
            this.y[i] = Math.random()*canHeight;
            this.spd[i] = 1+ Math.random()*3;
            this.m[i] = m.msg;
            return;
        }
    }
}