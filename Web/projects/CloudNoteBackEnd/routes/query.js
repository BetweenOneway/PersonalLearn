var pool=require("../pool");
module.exports=function(sql,params){
  return new Promise(function(open,err){
    pool.getConnection(function(error,connection){
        if(error)err(error);
        connection.beginTransaction(error=>{
            if(error)err(error);
            connection.query(sql,params, function (error, results, fields) {
                if(error) err(error);
                else open(result); 
            })
        });
    });
  })
}