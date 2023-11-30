//计分

var scoreObj = function(){
    this.score = 0;
}

scoreObj.prototype.draw = function(){
    ctx1.save();
    
    ctx1.fillStyle = "#FFF";
    ctx1.font="35px Verdana";
    ctx1.textAlign = "center";
    ctx1.fillText("SCORE:"+this.score,canWidth*0.5,canHeight*0.8);

    ctx1.restore();
}

//type食物类型 2 橙色食物 1 蓝色食物
scoreObj.prototype.add = function(type){
    this.score += 100*type;
}