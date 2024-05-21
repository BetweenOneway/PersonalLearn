var pool=require("../pool");

module.exports=function(sql,params,callback){
  return new Promise(function(suc,err){
    pool.getConnection(function(error,connection){
        if(error) throw error;
        connection.beginTransaction(error=>{
            if(error) throw error;
            connection.query(sql,params, function (error, results, fields) {
                if(error)
                {
                    throw error;
                }
                else
                {
                    console.log(results);
                    suc(results); 
                }
            })
        });
    });
  })
}