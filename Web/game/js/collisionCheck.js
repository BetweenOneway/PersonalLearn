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
            //
            var type = 1;
            if(food.foodType[i] != "blue")
            {
                type = 2;
            }
            score.add(type);

            wave.born(food.x[i],food.y[i]);
        }
    }
}