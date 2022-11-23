

export class Token{
    constructor(type, val) {
        this.type = type;
        this.val = val;
    }
}

export function lex(inputStream){
    let token = null;
    let char;

    switch (char = inputStream.read()){
        case ' ': case '\n': return lex(inputStream);
        case null: token = new Token('EOP', ''); break;
        case '+': token = new Token('SUM', 'ADD'); break;
        case '-': token = new Token('SUM', 'SUB'); break;
        case '*': token = new Token('PROD', 'MUL'); break;
        case '/': token = new Token('PROD', 'DIV'); break;
        case '(': token = new Token('LBR', ''); break;
        case ')': token = new Token('RBR', ''); break;
        case '{': token = new Token('LCB', ''); break;
        case '}': token = new Token('RCB', ''); break;
        case ';': token = new Token('SEM', ''); break;
        case '=': token = inputStream.peek('=') ? new Token('CMP', 'EQ') : new Token('ASSN', ''); break;
        case '<': token = new Token('CMP', inputStream.peek('=') ? 'LEQ' : 'LE'); break;
        case '>': token = new Token('CMP', inputStream.peek('=') ? 'GEQ' : 'GE'); break;
        case '!': token = inputStream.peek('=') ? new Token('CMP', 'NEQ') : new Token('LOG', 'NOT'); break;
        default:
            // ID
            if(/^[A-Za-z]+$/.test(char)){
                let val = char;
                while((char = inputStream.read()) && /^[A-Za-z]+$/.test(char)) val += char;
                switch (val){
                    case 'if': token = new Token('IF', '');break;
                    case 'else': token = new Token('ELSE', '');break;
                    case 'for': token = new Token('FOR', '');break;
                    case 'true': case 'false': token = new Token('BOOL', val);break;
                    case 'int': case 'bool': token = new Token('TYPE', val);break;
                    case 'function': token = new Token('FUNC', val);break;
                    default: token = new Token('ID', val);break;
                }
            }
            // NUMBER
            else if(/^[0-9]+$/.test(char)){
                let val = char;
                while((char = inputStream.read()) && /^[0-9]+$/.test(char)) val += char;
                token = new Token('NUM', val);
            }
            // ERROR
            else{
                console.error(`Lexer Unresolved symbol: ${char}`)
            }
            inputStream.unread();
            break;
    }
    return token;
}