"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalNumberExpr = void 0;
function evalNumberExpr(leftHand, rightHand, op) {
    let result;
    if (op === '+') {
        result = leftHand.value + rightHand.value;
    }
    else if (op === '-') {
        result = leftHand.value - rightHand.value;
    }
    else if (op === '*') {
        result = leftHand.value * rightHand.value;
    }
    else if (op === '/') {
        result = leftHand.value / rightHand.value;
    }
    else if (op === '%') {
        result = leftHand.value % rightHand.value;
    }
    else {
        result = leftHand.value ** rightHand.value;
    }
    return { type: 'number', value: result };
}
exports.evalNumberExpr = evalNumberExpr;
