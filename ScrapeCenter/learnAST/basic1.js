//当前目录执行npx babel-node basic1.js
import {parse} from "@babel/parser"
import generate from "@babel/generator"
import fs from "fs"

const code = fs.readFileSync("codes/code1.js","utf-8")
//JS代码=>AST
let ast = parse(code)
console.log(ast)

//AST=>JS代码
const {code:output} = generate(ast)
console.log(output)