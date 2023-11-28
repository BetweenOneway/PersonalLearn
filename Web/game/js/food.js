var foodObj = function(){
    //true 显示 false 隐藏
    this.alive = [];
    this.blue = new Image();
    this.orange = new Image();
    this.x = [];
    this.y = [];
    //图片高度和宽度
    this.l = [];
    this.spd = [];
    this.foodType = [];
    this.aneNo = [];
}

foodObj.prototype.num = 30;
foodObj.prototype.init = function(){
    for(var i=0;i<this.num;i++)
    {
        this.alive[i] = false;
        this.x[i] = 0;
        this.y[i] = 0;
        this.l[i] = 0;
        this.foodType[i] = "";
        this.spd[i] = 0;
    }
    this.blue.src = "res/blue.png";
    this.orange.src = "res/fruit.png";
}

foodObj.prototype.draw = function(){
    for(var i=0;i<this.num;i++)
    {
        if(this.alive[i])
        {
            if(this.foodType[i]=="blue")
            {
                var pic = this.blue;
            }
            else{
                var pic =this.orange;
            }
            if(this.l[i]<=14)
            {
                this.l[i]+=this.spd[i]*deltaTime;
            }
            else{
                this.y[i]-=this.spd[i]*deltaTime*3;
            }
            ctx2.drawImage(pic,this.x[i],this.y[i],this.l[i],this.l[i]);
        }
        if(this.y[i] < 10)
        {
            this.alive[i] = false;
        }
    }
}

//监听画布食物数量 不足15个挑
function foodMonitor(){
    var num =0;
    for(var i=0;i<food.num;i++)
    {
        if(food.alive[i])
        {
            num++;
        }
    }

    if(num<15)
    {
        generateFood();
        return;
    }
}

function generateFood()
{
    for(var i=0;i<food.num;i++)
    {
        if(food.alive[i] == false)
        {
            food.born(i);
            return;
        }
    }
}

foodObj.prototype.born = function(i)
{
    var idx = Math.floor(ane.num*Math.random());
    var x = ane.headx[idx];
    var y = ane.heady[idx];
    this.x[i] = x;
    this.y[i] = y;
    this.alive[i] = true;
    this.l[i] = 0;
    this.foodType[i] = Math.random()<0.9?"blue":"orange";
    this.spd[i] = Math.random()*0.017;
}

foodObj.prototype.dead = function(i){
    this.alive[i] = false;
}