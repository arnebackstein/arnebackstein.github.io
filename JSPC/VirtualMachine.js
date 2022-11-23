export class VirtualMachine{
    constructor(symbolTable, code, stackHTMLElem, symbolTableHTMLElem) {
        this.stack = [];

        this.symbolTable = symbolTable;

        this.symbolTableHTMLElem = symbolTableHTMLElem;
        this.symbolTableHTMLElem.innerHTML = '<thead><tr><th>Symbol Table</th></tr></thead>';
        this.symbolTableBody = document.createElement('tbody');
        this.symbolTableHTMLElem.appendChild(this.symbolTableBody);

        this.stackHTMLElem = stackHTMLElem;
        this.stackHTMLElem.innerHTML = '<thead><tr><th>Stack</th></tr></thead>';
        this.stackBody = document.createElement('tbody');
        this.stackHTMLElem.appendChild(this.stackBody);

        this.pc = 0;
        this.code = code;
    }

    drawStack(){
        this.stackBody.innerHTML = '';
        this.stack.forEach((item) => {
            let trElem = document.createElement('tr');
            let elem = document.createElement('td');
            elem.innerHTML = item;
            trElem.appendChild(elem);
            this.stackBody.prepend(trElem);
        });
    }

    drawSymbolTable(){
        this.symbolTableBody.innerHTML = '';
        Object.keys(this.symbolTable.table).forEach((symbol) => {
            let trElem = document.createElement('tr');
            let symbolElem = document.createElement('td');
            let typeElem = document.createElement('td');
            let valueElem = document.createElement('td');
            symbolElem.innerHTML = symbol;
            typeElem.innerHTML = this.symbolTable.table[symbol].type;
            valueElem.innerHTML = this.symbolTable.table[symbol].value;
            trElem.appendChild(symbolElem);
            trElem.appendChild(typeElem);
            trElem.appendChild(valueElem);
            this.symbolTableBody.append(trElem);
        });
    }

    debug(){
        if(!this.code) return;
        if(this.pc < this.code.length) this.execute(this.code[this.pc]);
        this.drawStack();
        this.drawSymbolTable();
    }

    run(){
        if(!this.code) return;
        while(this.pc < this.code.length) this.execute(this.code[this.pc]);
    }

    /**
     * - ADD, SUB, MUL, DIV: take the upper two elements from
     *   the stack and perform arithmetic operation and push them
     *   onto the stack
     * - READ <ID>: reads the variable <ID> from memory onto the stack
     * - WRITE <ID>: writes the uppermost element from the stack to the
     *   memory and removes them from the stack
     * - PUSH <LITERAL>: pushes a literal onto the stack
     * - POP: removes one element from the stack
     * //TODO add all remaining
     * @param op
     */
    execute(op){
        switch (op) {
            case 'ADD': this.stack.push(parseInt(this.stack.pop()) + parseInt(this.stack.pop()));break;
            case 'SUB': this.stack.push(parseInt(this.stack.pop()) - parseInt(this.stack.pop()));break;
            case 'MUL': this.stack.push(parseInt(this.stack.pop()) * parseInt(this.stack.pop()));break;
            case 'DIV': this.stack.push(Math.floor((1./parseInt(this.stack.pop())) * parseInt(this.stack.pop())));break;
            case 'EQ': this.stack.push(this.stack.pop() == this.stack.pop() ? "true" : "false");break;
            case 'NEQ': this.stack.push(this.stack.pop() !== this.stack.pop() ? "true" : "false");break;
            case 'NEG': this.stack.push(this.stack.pop() === "true" ? "false" : "true");break;
            case 'PUSH_PC': this.stack.push(this.pc);break;
            case 'POP': this.stack.pop();break;
            default:
                if(/^PUSH/.test(op)) this.stack.push(op.slice(5));
                else if(/^WRITE/.test(op)) this.symbolTable.set(op.slice(6),this.stack.pop());
                else if(/^READ/.test(op)) this.stack.push(this.symbolTable.get(op.slice(5)));
                else if(/^BRANCH/.test(op)) this.pc = this.stack.pop()-1;
                else if(/^CBRANCH/.test(op)) {
                    this.pc = this.stack.pop() === "true" ? this.stack.pop()-1 : this.pc;
                    this.stack.pop();
                }
                break;
        }
        this.pc++;
    }
}