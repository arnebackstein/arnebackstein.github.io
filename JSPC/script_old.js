/*
     arithmeticOperand: + - * /
     compareOperand: ==
     assignOperand: =
     literal: 1,2,3,... | 1.9123
     name: abc...
 */

class Token {
    constructor(text, position) {
        this.text = text;
        this.position = position;
    }
}

class ArithmeticOperandToken extends Token {
    static regex = new RegExp('^[-*/+]');

    static match(text, position) {
        let match = text.match(this.regex);
        if (!match) return null;
        return new ArithmeticOperandToken(match[0], position);
    }
}

class CompareOperandToken extends Token {
    static regex = new RegExp('^(==|<=|>=|<|>)');

    static match(text, position) {
        let match = text.match(this.regex);
        if (!match) return null;
        return new CompareOperandToken(match[0], position);
    }
}

class AssignOperandToken extends Token {
    static regex = new RegExp('^=');

    static match(text, position) {
        let match = text.match(this.regex);
        if (!match) return null;
        return new AssignOperandToken(match[0], position);
    }
}

class LiteralToken extends Token {
    static regex = new RegExp('^([0-9]+\\.?[0-9]*)');

    static match(text, position) {
        let match = text.match(this.regex);
        if (!match) return null;
        return new LiteralToken(match[0], position);
    }
}

class IdToken extends Token {
    static regex = new RegExp('^[a-z][a-z0-9]*');

    static match(text, position) {
        let match = text.match(this.regex);
        if (!match) return null;
        return new IdToken(match[0], position);
    }
}

function tokenize(text, offset) {
    if (text == null || text.length === 0) return [];

    const regexWhitespace = new RegExp('^\\s');
    let whitespace = text.match(regexWhitespace);
    if (whitespace) return tokenize(text.slice(whitespace[0].length), offset + whitespace[0].length);


    let currentToken = ArithmeticOperandToken.match(text, offset) ||
        CompareOperandToken.match(text, offset) ||
        AssignOperandToken.match(text, offset) ||
        LiteralToken.match(text, offset) ||
        IdToken.match(text, offset);

    if (!currentToken) {
        console.error("SyntaxError");
        return [];
    }

    let restTokens = tokenize(text.slice(currentToken.text.length), offset + currentToken.text.length);
    return [currentToken].concat(restTokens);
}

function parse() {

}

function compile(text){
    console.log(tokenize(text, 0));
}

let code = document.getElementById("code");
let compileButton = document.getElementById("compileButton");
compileButton.addEventListener('click', () => compile(code.value.replace('\n', ' ')));
compile(code.value.replace('\n', ' '));


/*
stmt := id "=" expr ";"
stmt := "{" stmtList "}"
stmt := if "(" expr ")" stmt
stmtList := stmt
stmtList := stmtList stmt
expr := term { ("<" | ">" | "<=" | ">=" | "==" | "!=") expr }
term := prod { ("+" | "-") term }
prod := prim { ( "*" | "\" ) prod }
prim := id | literal | "(" expr ")"
 */
