import {InputStream} from "./InputStream.js";
import {lex} from "./Lexer.js";
import {Parser} from "./Parser.js";
import {compile} from "./CodeGenerator.js";
import {VirtualMachine} from "./VirtualMachine.js";
import {SymbolTable} from "./SymbolTable.js";

const code = document.getElementById('codeInput');
const compileButton = document.getElementById('compileButton');
const debugButton = document.getElementById('debugButton');
const stackHTMLElem = document.getElementById('stack');
const compiledCodeElem = document.getElementById('compiledCode');
const symbolTableElem = document.getElementById('symbolTable');

let vm = null;

function formatInstructions(instructions, pc){
    let formattedInstructions = "";
    for(let i = 0; i < instructions.length; i++){
        if(i === pc) formattedInstructions += `<s>${instructions[i]}</s></br>`
        else formattedInstructions += `${instructions[i]}</br>`;
    }
    return `<p>${formattedInstructions}</p>`;
}

function runCompilation(){
    const inputStream = new InputStream(code.value);
    let parser = new Parser(inputStream);
    let node = parser.parseStmtList();
    console.log(node);
    let instructions = compile(node);
    console.log(parser.symbolTable)
    compiledCodeElem.innerHTML = formatInstructions(instructions, 0);
    vm = new VirtualMachine(parser.symbolTable, instructions, stackHTMLElem, symbolTableElem);
    return instructions;
}

function debug(){
    if(!vm) return;
    vm.debug();
    compiledCodeElem.innerHTML = formatInstructions(vm.code, vm.pc);
}


compileButton.addEventListener('click', () => runCompilation());
debugButton.addEventListener('click', () => debug());


