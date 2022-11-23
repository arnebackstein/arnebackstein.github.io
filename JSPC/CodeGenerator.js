
export function compile(node){
    switch (node.type){
        case 'ID': return [`READ ${node.val}`];
        case 'NUM': return [`PUSH ${node.val}`];
        case 'BOOL': return [`PUSH ${node.val}`];
        case 'ASSN': return compile(node.right).concat(`WRITE ${node.left.val}`);
        case 'PROD': case 'SUM': case 'CMP': return compile(node.left).concat(compile(node.right)).concat(`${node.val}`);
        case 'STMTLIST': return compile(node.left).concat(node.right ? compile(node.right) : []);
        case 'COND':
            let cond = compile(node.left);
            let trueStmt = node.right.left ? compile(node.right.left) : [];
            let falseStmt = node.right.right ? compile(node.right.right) : [];
        return [`PUSH_PC`, `PUSH ${trueStmt.length + cond.length + 9}`, `ADD`].concat(cond).concat(["NEG","CBRANCH"])
            .concat(trueStmt).concat(["PUSH_PC", `PUSH ${falseStmt.length + 4}`, "ADD", "BRANCH"]).concat(falseStmt);
        default: return [];
    }
}