const code = `
var $ = function(id){
    return document.getElementById(id);
};
var a='hello world'
let x = '1'+1
console.log('x',x)
`

const options = {
    compact:true,//代码压缩
    identifierNamesGenerator:'mangled',//变量名混淆
    idetifiersPrefix:'germey',//混淆变量前缀
    renameGlobals:true,//是否混淆全局变量和函数名称
    stringArray:true,//字符串混淆
    selfDefending:true,//代码自我保护
    controlFlowFlattening:true//控制流平坦化
}

const obfuscator = require('javascript-obfuscator')

function obfuscate(code,options){
    return obfuscator.obfuscate(code,options).getObfuscatedCode()
}
console.log(obfuscate(code,options))