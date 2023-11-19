// var start = new Date().getTime();
// do{
//     var end = new Date().getTime();
// }while(end-start < 5000)

// console.log("5s end")

//接收数据
onmessage = function(e){
    console.log("From UI:"+e.data);
    postMessage(456);
}
