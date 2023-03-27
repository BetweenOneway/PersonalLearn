var arr=[23,9,45,78,6]; 
console.log(arr.sort((a,b)=>{return a-b}));

var month = 12;
var year = 2021;
var date = 20;
var day="Mon";
var hour = 11;
console.log(`今天是${year}年${month+1}月${date}日 
${day} ${hour>12?'下午':'上午'}`);