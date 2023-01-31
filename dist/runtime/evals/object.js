"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalObjectExpr = void 0;
const interpreter_1 = require("../interpreter");
function evalObjectExpr(obj, env) {
    const object = {
        type: 'object',
        properties: new Map()
    };
    for (const { key, value } of obj.property) {
        const runtimeVal = (value == undefined)
            ? env.loopupVar(key)
            : (0, interpreter_1.evaluate)(value, env);
        object.properties.set(key, runtimeVal);
    }
    return object;
}
exports.evalObjectExpr = evalObjectExpr;
