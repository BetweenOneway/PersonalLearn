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
        this.y[i] = 100;
        this.m[i] = "666";
        this.font[i] = "12px";
        this.color[i] = "#000";
        this.spd[i] = 3;
        this.alive[i] = true;
    }
}

//将数据绘制到网站中
msgObj.prototype.draw = function(){
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
        }
    }
}

//将新弹幕添加到弹幕池中
msgObj.prototype.add = function(m){}