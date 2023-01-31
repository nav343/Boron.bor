"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalBinExpr = void 0;
const interpreter_1 = require("../interpreter");
const value_1 = require("../value");
const numberExpr_1 = require("./numberExpr");
function evalBinExpr(expr, env) {
    const leftHand = (0, interpreter_1.evaluate)(expr.left, env);
    const rightHand = (0, interpreter_1.evaluate)(expr.right, env);
    if (leftHand.type === 'number' || rightHand.type === 'number') {
        return (0, numberExpr_1.evalNumberExpr)(leftHand, rightHand, expr.op);
    }
    return (0, value_1.MKNULL)();
}
exports.evalBinExpr = evalBinExpr;
