"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalVarDeclaration = void 0;
const interpreter_1 = require("../interpreter");
const value_1 = require("../value");
function evalVarDeclaration(declaration, env) {
    const value = declaration.value
        ? (0, interpreter_1.evaluate)(declaration.value, env)
        : (0, value_1.MKNULL)();
    return env.declareVariable(declaration.identifier, value, declaration.constant);
}
exports.evalVarDeclaration = evalVarDeclaration;
