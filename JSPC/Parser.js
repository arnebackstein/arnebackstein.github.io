import {lex, Token} from "./Lexer.js";
import {Node} from './Ast.js';
import {SymbolTable} from "./SymbolTable.js";

/*
decl := type id { "=" expr } ";"
stmt := id "=" expr ";"
stmt := "{" stmtList "}"
stmt := if "(" expr ")" stmt
stmtList := stmt
stmtList := stmt stmtList
expr := term { ("<" | ">" | "<=" | ">=" | "==" | "!=") expr }
term := prod { ("+" | "-") term }
prod := prim { ( "*" | "\" ) prod }
prim := id | literal | "(" expr ")"
literal := NUM | BOOL
type := "int" | "bool"
 */

export class Parser {
    constructor(inputStream) {
        this.inputStream = inputStream;
        this.token = lex(this.inputStream);
        this.symbolTable = new SymbolTable();
    }

    accept(type) {
        if (this.token.type === type) {
            this.token = lex(this.inputStream);
            return true;
        } else return false;
    }

    expect(type) {
        if (!this.accept(type))
            console.error(`Parser SyntaxError: Expected ${type} but was ${this.token.type}`);
    }

    parseStmt() {
        let tokenVal = this.token.val;
        if (this.accept("TYPE")) {
            let id = this.token.val;
            this.expect("ID");
            this.symbolTable.declare(id, tokenVal);
            if (this.accept('ASSN')) {
                let left = new Node('ID', null, null, id);
                let right = this.parseExpr();
                this.expect('SEM');
                return new Node('ASSN', left, right, '');
            }
            this.expect('SEM');
        } else if (this.accept('ID')) {
            this.expect('ASSN');
            let left = new Node('ID', null, null, tokenVal);
            let right = this.parseExpr();
            this.expect('SEM');
            return new Node('ASSN', left, right, '');
        } else if (this.accept('LCB')) {
            let node = this.parseStmtList();
            this.expect('RCB');
            return node;
        } else if (this.accept('IF')) {
            this.expect('LBR');
            let left = this.parseExpr();
            this.expect('RBR');
            let trueStmt = this.parseStmt();
            let falseStmt = null;
            if (this.accept('ELSE')) falseStmt = this.parseStmt();
            let stmtList = new Node('STMTLIST', trueStmt, falseStmt, '');
            return new Node('COND', left, stmtList, 'IF');
        } else return null;
    }

    parseStmtList() {
        let left = this.parseStmt();
        if (!left) return null;
        let right = this.parseStmtList();
        if (!right) return left;
        return new Node('STMTLIST', left, right, '');
    }

    parseExpr() {
        let left = this.parseTerm();
        let tokenVal = this.token.val;
        if (!this.accept('CMP')) return left;
        let right = this.parseExpr();
        return new Node('CMP', left, right, tokenVal);
    }

    parseTerm() {
        let left = this.parseProd();
        let tokenVal = this.token.val;
        if (!this.accept('SUM')) return left;
        let right = this.parseTerm();
        return new Node('SUM', left, right, tokenVal);
    }

    parseProd() {
        let left = this.parsePrim();
        let tokenVal = this.token.val;
        if (!this.accept('PROD')) return left;
        let right = this.parseProd();
        return new Node('PROD', left, right, tokenVal);
    }

    parsePrim() {
        let tokenVal = this.token.val;
        if (this.accept('LBR')) {
            let left = this.parseExpr();
            this.expect('RBR');
            return left;
        } else if (this.accept('NUM')) {
            return new Node('NUM', null, null, tokenVal);
        } else if (this.accept('ID')) {
            return new Node('ID', null, null, tokenVal);
        } else if (this.accept('BOOL')) {
            return new Node('BOOL', null, null, tokenVal);
        } else {
            console.error(`Parser SyntaxError: Expected NUM or ID or ( expr ) but was ${this.token.type}`);
        }
    }

}

