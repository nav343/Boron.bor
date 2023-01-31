"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalAssignmentExpr = void 0;
const interpreter_1 = require("../interpreter");
function evalAssignmentExpr(node, env) {
    if (node.assign.kind != 'Identifier') {
        console.log(`Invalid Syntax. Cannot assign with LHS being ${node.assign.kind}`);
    }
    const varName = node.assign.symbol;
    return env.assignVariable(varName, (0, interpreter_1.evaluate)(node.value, env));
}
exports.evalAssignmentExpr = evalAssignmentExpr;
