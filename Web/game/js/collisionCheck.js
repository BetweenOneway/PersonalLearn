//碰撞检测

//大鱼与食物的碰撞检测
function momFoodCollision(){
    for(var i=0;i<food.num;i++)
    {
        if(!food.alive[i])
        {
            continue;
        }
        var l = calLength2(food.x[i],food.y[i],mom.x,mom.y);
        //两者距离在30个像素之内
        if(l < 900)
        {
            food.dead(i);
        }
    }
}