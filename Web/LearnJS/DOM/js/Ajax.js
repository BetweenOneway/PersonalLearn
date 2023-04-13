function ajax({url,type="get",data}){
    return new Promise(
        function(resolve,reject)
        {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status==200)
                {
                    var result = JSON.parse(xhr.responseText);
                    resolve(result);
                }
            }
            if(type=="get" && data !== undefined)
            {
                url+="?"+data;
            }
            xhr.open(type,url,true);
            if(type=="post")
            {
                xhr.setRequestHeader("Content-Type","application/x-www/form-urlencoded");
                xhr.send(data);
            }
            else
            {
                xhr.send();
            }
        }
    );
}