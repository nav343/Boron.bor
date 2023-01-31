"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalCallExpr = void 0;
const env_1 = __importDefault(require("../env"));
const interpreter_1 = require("../interpreter");
const value_1 = require("../value");
function evalCallExpr(expr, env) {
    const args = expr.args.map((arg) => (0, interpreter_1.evaluate)(arg, env));
    const fn = (0, interpreter_1.evaluate)(expr.caller, env);
    if (fn.type == 'nativeFn') {
        const res = fn.call(args, env);
        return res;
    }
    if (fn.type == "function") {
        const func = fn;
        const scope = new env_1.default(func.declarationEnv);
        for (let i = 0; i < func.params.length; i++) {
            const varname = func.params[i];
            scope.declareVariable(varname, args[i], false);
        }
        let result = (0, value_1.MKNULL)();
        for (const stmt of func.body) {
            result = (0, interpreter_1.evaluate)(stmt, scope);
        }
        return result;
    }
    console.log(`Cannot call "${expr.caller.symbol}" as it is not a function.`);
    return { type: 'null' };
}
exports.evalCallExpr = evalCallExpr;
