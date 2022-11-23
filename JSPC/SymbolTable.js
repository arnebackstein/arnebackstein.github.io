export class SymbolTable{
    constructor() {
        this.table = {};
    }

    declare(symbol, type){
        this.table[symbol] = {
            "value": undefined,
            "type": type
        };
    }

    set(symbol, value){
        if(this.table[symbol]) this.table[symbol].value = value;
        else console.error(`Trying to set ${symbol} but was not initialized`);
    }

    get(symbol){
        if(this.table[symbol]) return this.table[symbol].value;
        else console.error(`Trying to get ${symbol} but was not initialized`);
    }
}